import { Component, AfterViewChecked, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, AiChatMessage } from '../services/chatbot.service';

interface UiMessage {
  from: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent implements AfterViewChecked {
  @ViewChild('msgList') msgList!: ElementRef;
  @Input() pageContext = '';

  messages: UiMessage[] = [
    { from: 'bot', text: 'Hi! I\'m your TripFlow AI travel assistant. Ask me anything — destinations, hotels, tips, visa info, and more! ✈️' }
  ];

  history: AiChatMessage[] = [];
  userInput = '';
  loading = false;

  constructor(private chatbotService: ChatbotService) {}

  ngAfterViewChecked(): void {
    try {
      this.msgList.nativeElement.scrollTop = this.msgList.nativeElement.scrollHeight;
    } catch {}
  }

  send(): void {
    const text = this.userInput.trim();
    if (!text || this.loading) return;

    this.messages.push({ from: 'user', text });
    this.history.push({ role: 'user', content: text });
    this.userInput = '';
    this.loading = true;

    this.chatbotService.sendAiMessage(this.history, this.pageContext).subscribe({
      next: (res) => {
        this.loading = false;
        this.messages.push({ from: 'bot', text: res.reply });
        this.history.push({ role: 'assistant', content: res.reply });
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.error ?? 'Something went wrong. Please try again.';
        this.messages.push({ from: 'bot', text: msg });
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
