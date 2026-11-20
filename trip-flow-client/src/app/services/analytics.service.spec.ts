import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  AnalyticsService,
  DashboardSummary,
  HotelSummary,
  MonthlyStats
} from './analytics.service';
import { environment } from '../../environments/environment';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/analytics`;

  const mockDashboard: DashboardSummary = {
    totalBookings: 119390,
    totalCanceled: 44224,
    cancellationRate: 37.04,
    avgAdr: 101.83,
    totalGuests: 211329,
    topCountry: 'PRT',
    mostBookedHotel: 'City Hotel'
  };

  const mockHotels: HotelSummary[] = [
    { hotel: 'City Hotel',   totalBookings: 79330, canceled: 33102, cancellationRate: 41.73, avgAdr: 105.30 },
    { hotel: 'Resort Hotel', totalBookings: 40060, canceled: 11122, cancellationRate: 27.76, avgAdr: 94.95 }
  ];

  const mockMonthly: MonthlyStats[] = [
    { month: 'August', year: 2016, totalBookings: 3201, canceled: 720, avgAdr: 98.50 },
    { month: 'September', year: 2016, totalBookings: 3102, canceled: 680, avgAdr: 102.10 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnalyticsService]
    });
    service = TestBed.inject(AnalyticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDashboard()', () => {
    it('should GET dashboard summary', () => {
      service.getDashboard().subscribe(data => {
        expect(data.totalBookings).toBe(119390);
        expect(data.totalCanceled).toBe(44224);
        expect(data.cancellationRate).toBe(37.04);
        expect(data.avgAdr).toBe(101.83);
        expect(data.mostBookedHotel).toBe('City Hotel');
        expect(data.topCountry).toBe('PRT');
      });

      const req = httpMock.expectOne(`${apiUrl}/dashboard`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDashboard);
    });
  });

  describe('getByHotel()', () => {
    it('should GET hotel summaries array', () => {
      service.getByHotel().subscribe(data => {
        expect(data.length).toBe(2);
        expect(data[0].hotel).toBe('City Hotel');
        expect(data[0].totalBookings).toBe(79330);
        expect(data[1].avgAdr).toBe(94.95);
      });

      const req = httpMock.expectOne(`${apiUrl}/by-hotel`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHotels);
    });
  });

  describe('getMonthly()', () => {
    it('should GET monthly stats without year filter', () => {
      service.getMonthly().subscribe(data => {
        expect(data.length).toBe(2);
        expect(data[0].month).toBe('August');
      });

      const req = httpMock.expectOne(r => r.url === `${apiUrl}/monthly`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMonthly);
    });

    it('should GET monthly stats with year filter', () => {
      service.getMonthly(2016).subscribe(data => {
        expect(data[0].year).toBe(2016);
      });

      const req = httpMock.expectOne(r =>
        r.url === `${apiUrl}/monthly` && r.params.get('year') === '2016'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockMonthly);
    });
  });
});
