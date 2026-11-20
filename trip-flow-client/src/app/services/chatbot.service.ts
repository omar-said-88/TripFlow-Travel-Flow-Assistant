import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatbotSearchRequest {
  country?: string;
  checkInMonth?: string;
  checkInYear?: number;
  adults: number;
  children: number;
  maxBudget?: number;
  roomType?: string;
}

export interface ChatbotHotelResult {
  hotelName: string;
  country: string;
  roomType: string;
  averageDailyRate: number;
  matchCount: number;
  bookingUrl: string;
}

export interface ChatbotSearchResponse {
  results: ChatbotHotelResult[];
  totalMatches: number;
  searchSummary: string;
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatResponse {
  reply: string;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly apiUrl = `${environment.apiUrl}/chatbot`;

  constructor(private http: HttpClient) {}

  search(request: ChatbotSearchRequest): Observable<ChatbotSearchResponse> {
    return this.http.post<ChatbotSearchResponse>(`${this.apiUrl}/search`, request);
  }

  sendAiMessage(messages: AiChatMessage[], pageContext = ''): Observable<AiChatResponse> {
    return this.http.post<AiChatResponse>(`${this.apiUrl}/message`, { messages, pageContext });
  }
}
