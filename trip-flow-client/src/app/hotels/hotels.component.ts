import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AnalyticsService, HotelSummary } from '../services/analytics.service';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {

  /* ── State ── */
  allHotels: HotelSummary[] = [];
  filtered: HotelSummary[] = [];
  loading = true;
  error = '';

  /* ── Search / sort ── */
  searchQuery = '';
  sortKey: 'name' | 'price' | 'bookings' | 'cancellation' = 'bookings';
  sortDir: 'asc' | 'desc' = 'desc';

  /* ── Price filter ── */
  maxPrice = 500;
  priceFilter = 500;

  /* ── Stock images cycled per hotel ── */
  private readonly images = [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d7d9d4f45?w=600&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80'
  ];

  imageFor(index: number): string {
    return this.images[index % this.images.length];
  }

  ratingLabel(avgAdr: number): string {
    if (avgAdr >= 200) return 'Superb';
    if (avgAdr >= 150) return 'Excellent';
    if (avgAdr >= 100) return 'Very Good';
    return 'Good';
  }

  ratingScore(avgAdr: number): number {
    return Math.min(9.9, Math.round((7 + (avgAdr / 200)) * 10) / 10);
  }

  constructor(private analyticsService: AnalyticsService, private router: Router) {}

  ngOnInit(): void {
    this.analyticsService.getByHotel().subscribe({
      next: (data) => {
        this.allHotels = data;
        this.maxPrice = Math.ceil(Math.max(...data.map(h => h.avgAdr)) / 50) * 50;
        this.priceFilter = this.maxPrice;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load hotels. Is the backend running?';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    let result = [...this.allHotels];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(h => h.hotel.toLowerCase().includes(q));
    }

    result = result.filter(h => h.avgAdr <= this.priceFilter);

    result.sort((a, b) => {
      let valA: number | string, valB: number | string;
      switch (this.sortKey) {
        case 'name':        valA = a.hotel;         valB = b.hotel;         break;
        case 'price':       valA = a.avgAdr;        valB = b.avgAdr;        break;
        case 'cancellation':valA = a.cancellationRate; valB = b.cancellationRate; break;
        default:            valA = a.totalBookings;  valB = b.totalBookings; break;
      }
      if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    this.filtered = result;
  }

  setSort(key: typeof this.sortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'desc';
    }
    this.applyFilters();
  }

  viewDetails(hotel: HotelSummary, index: number): void {
    this.router.navigate(['/hotel-details'], {
      state: {
        hotel: {
          name: hotel.hotel,
          image: this.imageFor(index),
          ratingScore: this.ratingScore(hotel.avgAdr),
          ratingLabel: this.ratingLabel(hotel.avgAdr),
          reviews: hotel.totalBookings,
          location: hotel.hotel,
          price: Math.round(hotel.avgAdr)
        }
      }
    });
  }

  currentYear = new Date().getFullYear();
  menuOpen = false;
  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }
}
