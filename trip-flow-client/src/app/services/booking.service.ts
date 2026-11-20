import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BookingDto {
  id: number;
  hotel: string;
  isCanceled: boolean;
  guestName: string;
  guestEmail: string;
  arrivalDateYear: number;
  arrivalDateMonth: string;
  arrivalDateDayOfMonth: number;
  adults: number;
  children: number;
  reservationStatus: string;
  adr: number;
  country: string;
  marketSegment: string;
  reservedRoomType: string;
}

// Backward-compatible alias
export type Booking = BookingDto;

export interface PagedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BookingQueryParams {
  page?: number;
  pageSize?: number;
  hotel?: string;
  country?: string;
  reservationStatus?: string;
  isCanceled?: boolean;
  year?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateBookingDto {
  hotel: string;
  guestName: string;
  guestEmail: string;
  phoneNumber: string;
  arrivalDateYear: number;
  arrivalDateMonth: string;
  arrivalDateDayOfMonth: number;
  adults: number;
  children: number;
  babies: number;
  meal: string;
  country: string;
  reservedRoomType: string;
  depositType: string;
  adr: number;
}

export interface UpdateBookingDto extends CreateBookingDto {
  isCanceled: boolean;
  reservationStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAll(params?: BookingQueryParams): Observable<PagedResult<BookingDto>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page != null)          httpParams = httpParams.set('page',               params.page.toString());
      if (params.pageSize != null)      httpParams = httpParams.set('pageSize',           params.pageSize.toString());
      if (params.hotel)                 httpParams = httpParams.set('hotel',              params.hotel);
      if (params.country)               httpParams = httpParams.set('country',            params.country);
      if (params.reservationStatus)     httpParams = httpParams.set('reservationStatus',  params.reservationStatus);
      if (params.isCanceled != null)    httpParams = httpParams.set('isCanceled',         params.isCanceled.toString());
      if (params.year != null)          httpParams = httpParams.set('year',               params.year.toString());
      if (params.search)                httpParams = httpParams.set('search',             params.search);
      if (params.sortBy)                httpParams = httpParams.set('sortBy',             params.sortBy);
      if (params.sortOrder)             httpParams = httpParams.set('sortOrder',          params.sortOrder);
    }
    return this.http.get<PagedResult<BookingDto>>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<BookingDto> {
    return this.http.get<BookingDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateBookingDto): Observable<BookingDto> {
    return this.http.post<BookingDto>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateBookingDto): Observable<BookingDto> {
    return this.http.put<BookingDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
