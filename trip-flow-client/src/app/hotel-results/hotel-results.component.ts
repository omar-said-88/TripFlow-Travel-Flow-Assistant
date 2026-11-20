import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { filterHotelsByDestination, MockHotel } from '../services/hotels-data';
import { AiChatComponent } from '../chatbot/ai-chat.component';

/* ── Interfaces ── */
interface Hotel {
  id: number;
  name: string;
  image: string;
  stars: number;
  reviews: number;
  ratingScore: number;
  ratingLabel: string;
  location: string;
  price: number;
  tags: string[];
  propertyType: string;
}

interface StarFilter {
  stars: number;
  label: string;
  checked: boolean;
}

interface PropertyFilter {
  type: string;
  checked: boolean;
}

interface GuestRatingFilter {
  min: number;
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-hotel-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AiChatComponent],
  templateUrl: './hotel-results.component.html',
  styleUrls: ['./hotel-results.component.scss']
})
export class HotelResultsComponent implements OnInit {

  /* ══════════════════════════════════════════════
     NAVBAR
     ══════════════════════════════════════════════ */
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  /* ══════════════════════════════════════════════
     SEARCH SUMMARY
     ══════════════════════════════════════════════ */
  searchSummary = {
    location: '',
    dates: '',
    budget: ''
  };

  /* Editable search fields in the top bar */
  searchDestination = '';
  searchCheckIn = '';
  searchCheckOut = '';
  searchBudget = '';
  searchBarOpen = false;

  sortOption = 'best';

  /* ══════════════════════════════════════════════
     FILTERS
     ══════════════════════════════════════════════ */
  budgetMin = 50;
  budgetMax = 500;
  budgetValue = 300;

  starFilters: StarFilter[] = [
    { stars: 5, label: '5 Stars', checked: false },
    { stars: 4, label: '4 Stars', checked: false },
    { stars: 3, label: '3 Stars', checked: false }
  ];

  propertyTypes: PropertyFilter[] = [
    { type: 'Hotel', checked: true },
    { type: 'Apartment', checked: false },
    { type: 'Resort', checked: false }
  ];

  guestRatings: GuestRatingFilter[] = [
    { min: 8, label: '8+ Very Good', checked: false },
    { min: 7, label: '7+ Good', checked: false },
    { min: 6, label: '6+ Pleasant', checked: false }
  ];

  neighborhoods: string[] = ['All Neighborhoods'];
  selectedNeighborhood = 'All Neighborhoods';

  mobileFiltersOpen = false;

  toggleMobileFilters(): void {
    this.mobileFiltersOpen = !this.mobileFiltersOpen;
  }

  /* ══════════════════════════════════════════════
     HOTEL DATA
     ══════════════════════════════════════════════ */
  hotels: Hotel[] = [];
  hotelsLoading = false;
  hotelsError = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const dest = params['destination'] || '';
      const checkIn = params['checkIn'] || '';
      const checkOut = params['checkOut'] || '';
      const budget = params['budget'] || '';

      this.searchDestination = dest;
      this.searchCheckIn = checkIn;
      this.searchCheckOut = checkOut;
      this.searchBudget = budget;

      // Build display summary
      this.searchSummary.location = dest || 'All Destinations';

      if (checkIn && checkOut) {
        const ciDate = new Date(checkIn);
        const coDate = new Date(checkOut);
        const nights = Math.max(1, Math.round((coDate.getTime() - ciDate.getTime()) / (1000 * 60 * 60 * 24)));
        const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        this.searchSummary.dates = `${fmt(ciDate)} – ${fmt(coDate)} · ${nights} night${nights !== 1 ? 's' : ''}`;
      } else {
        this.searchSummary.dates = 'Any dates';
      }

      const budgetLabels: Record<string, string> = {
        low: 'Up to $500',
        mid: '$500 – $1,500',
        high: '$1,500 – $3,000',
        luxury: '$3,000+'
      };
      this.searchSummary.budget = budget ? budgetLabels[budget] || budget : 'Any budget';

      // Load hotels from mock dataset filtered by destination
      this.loadHotels(dest, budget);
    });
  }

  private ratingLabel(score: number): string {
    if (score >= 9.5) return 'Exceptional';
    if (score >= 9.0) return 'Superb';
    if (score >= 8.5) return 'Excellent';
    if (score >= 8.0) return 'Very Good';
    if (score >= 7.0) return 'Good';
    return 'Pleasant';
  }

  private loadHotels(dest: string, budget: string): void {
    this.hotelsLoading = true;

    // Filter by destination
    let results = filterHotelsByDestination(dest);

    // Pre-filter by budget category
    if (budget === 'low')     results = results.filter(h => h.price <= 500);
    else if (budget === 'mid')     results = results.filter(h => h.price > 500  && h.price <= 1500);
    else if (budget === 'high')    results = results.filter(h => h.price > 1500 && h.price <= 3000);
    else if (budget === 'luxury')  results = results.filter(h => h.price > 3000);

    // Build neighborhoods list from results
    const cities = [...new Set(results.map(h => h.city))];
    this.neighborhoods = ['All Neighborhoods', ...cities];
    this.selectedNeighborhood = 'All Neighborhoods';

    // Map to Hotel interface
    this.hotels = results.map((h: MockHotel) => ({
      id: h.id,
      name: h.name,
      image: h.image,
      stars: h.stars,
      reviews: h.reviews,
      ratingScore: h.ratingScore,
      ratingLabel: this.ratingLabel(h.ratingScore),
      location: `${h.city}, ${h.country}`,
      price: h.price,
      tags: h.tags,
      propertyType: h.propertyType
    }));

    this.hotelsLoading = false;
  }

  /* ══════════════════════════════════════════════
     HELPERS
     ══════════════════════════════════════════════ */

  /** Hotels after all sidebar filters + sort applied */
  get filteredHotels(): Hotel[] {
    const activeStars = this.starFilters.filter(s => s.checked).map(s => s.stars);
    const activeTypes = this.propertyTypes.filter(p => p.checked).map(p => p.type);
    const activeRatings = this.guestRatings.filter(g => g.checked).map(g => g.min);

    let list = this.hotels.filter(h => {
      if (h.price > this.budgetValue && this.budgetValue < this.budgetMax) return false;
      if (activeStars.length && !activeStars.includes(h.stars)) return false;
      if (activeTypes.length && !activeTypes.includes(h.propertyType)) return false;
      if (activeRatings.length && !activeRatings.some(min => h.ratingScore >= min)) return false;
      if (this.selectedNeighborhood !== 'All Neighborhoods' && !h.location.startsWith(this.selectedNeighborhood)) return false;
      return true;
    });

    switch (this.sortOption) {
      case 'price-low':  list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-high': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating':     list = [...list].sort((a, b) => b.ratingScore - a.ratingScore); break;
      case 'stars':      list = [...list].sort((a, b) => b.stars - a.stars); break;
    }

    return list;
  }

  updateSearch(): void {
    if (!this.searchDestination.trim()) return;
    this.searchBarOpen = false;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        destination: this.searchDestination.trim(),
        checkIn: this.searchCheckIn,
        checkOut: this.searchCheckOut,
        budget: this.searchBudget
      },
      queryParamsHandling: 'merge'
    });
  }

  starsArray(count: number): number[] {
    return Array(count).fill(0);
  }

  emptyStarsArray(count: number): number[] {
    return Array(5 - count).fill(0);
  }

  viewDetails(hotel: Hotel): void {
    this.router.navigate(['/hotel-details'], { state: { hotel } });
  }

  /* ── Chatbot ── */
  chatOpen = false;
  chatMode: 'preview' | 'chat' = 'preview';

  get hotelsContext(): string {
    if (!this.hotels.length) return '';
    const dest = this.searchSummary.location || 'selected destination';
    const list = this.hotels.slice(0, 8)
      .map(h => `${h.name} (${h.stars}★, $${h.price}/night, rated ${h.ratingScore})`)
      .join('; ');
    return `User is searching hotels in ${dest}. Currently showing: ${list}`;
  }

  /* ── Footer ── */
  currentYear = new Date().getFullYear();
}
