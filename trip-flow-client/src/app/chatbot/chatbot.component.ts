import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ChatbotService,
  ChatbotSearchRequest,
  ChatbotHotelResult,
  ChatbotSearchResponse
} from '../services/chatbot.service';

interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
  results?: ChatbotHotelResult[];
}

type Step = 'idle' | 'country' | 'month' | 'year' | 'adults' | 'children' | 'budget' | 'roomType' | 'searching' | 'done';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messageList') messageList!: ElementRef;

  messages: ChatMessage[] = [
    { from: 'bot', text: 'Welcome to TripFlow! Type "start" to search for hotels.' }
  ];

  userInput = '';
  step: Step = 'idle';
  loading = false;

  private request: ChatbotSearchRequest = { adults: 1, children: 0 };

  constructor(private chatbotService: ChatbotService, private router: Router) {}

  ngAfterViewChecked(): void {
    try {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
    } catch {}
  }

  send(): void {
    const input = this.userInput.trim();
    if (!input || this.loading) return;
    this.messages.push({ from: 'user', text: input });
    this.userInput = '';
    this.handleStep(input);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.send();
  }

  private bot(text: string, results?: ChatbotHotelResult[]): void {
    this.messages.push({ from: 'bot', text, results });
  }

  private handleStep(val: string): void {
    const skip = val.toLowerCase() === 'skip';

    switch (this.step) {
      case 'idle':
      case 'done':
        if (val.toLowerCase() === 'start') {
          this.request = { adults: 1, children: 0 };
          this.step = 'country';
          this.bot('Which country are you traveling to? (3-letter code, e.g. PRT, GBR — or "skip")');
        } else {
          this.bot('Type "start" to begin searching for hotels.');
        }
        break;

      case 'country':
        if (!skip && val.length > 0) this.request.country = val.toUpperCase().slice(0, 3);
        this.step = 'month';
        this.bot('Which month are you checking in? (e.g. July — or "skip")');
        break;

      case 'month':
        if (!skip) this.request.checkInMonth = val;
        this.step = 'year';
        this.bot('Which year? (e.g. 2017 — or "skip")');
        break;

      case 'year':
        const year = parseInt(val);
        if (!isNaN(year) && year >= 2015 && year <= 2030) this.request.checkInYear = year;
        this.step = 'adults';
        this.bot('How many adults? (e.g. 2)');
        break;

      case 'adults':
        const adults = parseInt(val);
        this.request.adults = !isNaN(adults) && adults > 0 ? adults : 1;
        this.step = 'children';
        this.bot('How many children? (Enter 0 if none)');
        break;

      case 'children':
        const children = parseInt(val);
        this.request.children = !isNaN(children) && children >= 0 ? children : 0;
        this.step = 'budget';
        this.bot('Maximum budget per night in USD? (e.g. 150 — or "skip")');
        break;

      case 'budget':
        const budget = parseFloat(val);
        if (!skip && !isNaN(budget) && budget > 0) this.request.maxBudget = budget;
        this.step = 'roomType';
        this.bot('Room type preference? (A=Standard, B, C, D, E=Suite, F, G — or "skip")');
        break;

      case 'roomType':
        if (!skip && val.length > 0) this.request.roomType = val.toUpperCase().slice(0, 1);
        this.searchHotels();
        break;
    }
  }

  private searchHotels(): void {
    this.step = 'searching';
    this.loading = true;
    this.bot('Searching for hotels...');

    this.chatbotService.search(this.request).subscribe({
      next: (res: ChatbotSearchResponse) => {
        this.loading = false;
        this.step = 'done';
        if (res.results.length === 0) {
          this.bot('No hotels found matching your criteria. Type "start" to try again.');
        } else {
          this.bot(res.searchSummary, res.results);
          this.bot('Type "start" to search again.');
        }
      },
      error: () => {
        this.loading = false;
        this.step = 'done';
        this.bot('Something went wrong. Type "start" to try again.');
      }
    });
  }

  bookNow(result: ChatbotHotelResult): void {
    this.router.navigateByUrl(result.bookingUrl);
  }
}
