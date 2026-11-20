import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardSummary {
  totalBookings: number;
  totalCanceled: number;
  cancellationRate: number;
  avgAdr: number;
  totalGuests: number;
  topCountry: string;
  mostBookedHotel: string;
}

export interface HotelSummary {
  hotel: string;
  totalBookings: number;
  canceled: number;
  cancellationRate: number;
  avgAdr: number;
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalBookings: number;
  canceled: number;
  avgAdr: number;
}

export interface CountryStats {
  country: string;
  totalBookings: number;
}

export interface RoomTypeStats {
  roomType: string;
  bookings: number;
  avgAdr: number;
}

export interface MarketSegmentStats {
  segment: string;
  bookings: number;
  avgAdr: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/dashboard`);
  }

  getByHotel(): Observable<HotelSummary[]> {
    return this.http.get<HotelSummary[]>(`${this.apiUrl}/by-hotel`);
  }

  getMonthly(year?: number): Observable<MonthlyStats[]> {
    let params = new HttpParams();
    if (year != null) params = params.set('year', year.toString());
    return this.http.get<MonthlyStats[]>(`${this.apiUrl}/monthly`, { params });
  }
}
