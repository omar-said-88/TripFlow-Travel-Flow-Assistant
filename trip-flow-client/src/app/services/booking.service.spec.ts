/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  BookingService,
  BookingDto,
  PagedResult,
  CreateBookingDto,
  UpdateBookingDto
} from './booking.service';
import { environment } from '../../environments/environment';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/bookings`;

  const mockBooking: BookingDto = {
    id: 1,
    hotel: 'Resort Hotel',
    isCanceled: false,
    guestName: 'Alice Smith',
    guestEmail: 'alice@example.com',
    arrivalDateYear: 2026,
    arrivalDateMonth: 'May',
    arrivalDateDayOfMonth: 10,
    adults: 2,
    children: 0,
    reservationStatus: 'Check-Out',
    adr: 180,
    country: 'GBR',
    marketSegment: 'Online TA',
    reservedRoomType: 'A'
  };

  const mockPagedResult: PagedResult<BookingDto> = {
    data: [mockBooking],
    totalCount: 1,
    page: 1,
    pageSize: 20,
    totalPages: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService]
    });
    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should GET bookings with no params', () => {
      service.getAll().subscribe(result => {
        expect(result.data.length).toBe(1);
        expect(result.totalCount).toBe(1);
      });

      const req = httpMock.expectOne(r => r.url === apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResult);
    });

    it('should build query params correctly', () => {
      service.getAll({ page: 2, pageSize: 10, hotel: 'City Hotel', country: 'PRT' }).subscribe();

      const req = httpMock.expectOne(r =>
        r.url === apiUrl &&
        r.params.get('page') === '2' &&
        r.params.get('pageSize') === '10' &&
        r.params.get('hotel') === 'City Hotel' &&
        r.params.get('country') === 'PRT'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResult);
    });

    it('should pass isCanceled filter', () => {
      service.getAll({ isCanceled: true }).subscribe();

      const req = httpMock.expectOne(r =>
        r.url === apiUrl && r.params.get('isCanceled') === 'true'
      );
      req.flush(mockPagedResult);
    });
  });

  describe('getById()', () => {
    it('should GET a single booking by id', () => {
      service.getById(1).subscribe(b => {
        expect(b.id).toBe(1);
        expect(b.guestName).toBe('Alice Smith');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBooking);
    });
  });

  describe('create()', () => {
    it('should POST a new booking and return BookingDto', () => {
      const dto: CreateBookingDto = {
        hotel: 'Resort Hotel',
        guestName: 'Alice Smith',
        guestEmail: 'alice@example.com',
        phoneNumber: '+441234567890',
        arrivalDateYear: 2026,
        arrivalDateMonth: 'May',
        arrivalDateDayOfMonth: 10,
        adults: 2,
        children: 0,
        babies: 0,
        meal: 'BB',
        country: 'GBR',
        reservedRoomType: 'A',
        depositType: 'No Deposit',
        adr: 180
      };

      service.create(dto).subscribe(b => {
        expect(b.id).toBe(1);
        expect(b.hotel).toBe('Resort Hotel');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mockBooking);
    });
  });

  describe('update()', () => {
    it('should PUT updated booking', () => {
      const dto: UpdateBookingDto = {
        hotel: 'Resort Hotel',
        guestName: 'Alice Smith',
        guestEmail: 'alice@example.com',
        phoneNumber: '+441234567890',
        arrivalDateYear: 2026,
        arrivalDateMonth: 'May',
        arrivalDateDayOfMonth: 10,
        adults: 2,
        children: 0,
        babies: 0,
        meal: 'BB',
        country: 'GBR',
        reservedRoomType: 'A',
        depositType: 'No Deposit',
        adr: 180,
        isCanceled: true,
        reservationStatus: 'Canceled'
      };

      service.update(1, dto).subscribe(b => {
        expect(b.isCanceled).toBeFalse(); // server response determines this
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockBooking);
    });
  });

  describe('delete()', () => {
    it('should DELETE a booking by id', () => {
      service.delete(1).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });
    });
  });
});
