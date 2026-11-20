import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookingService, CreateBookingDto } from '../services/booking.service';
import { AiChatComponent } from '../chatbot/ai-chat.component';

/* ── Interfaces ── */
interface BookingHotel {
  name: string;
  image: string;
  stars: number;
  reviewCount: number;
  ratingScore: number;
  ratingLabel: string;
  location: string;
}

interface BookingSummary {
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  adults: number;
  pricePerNight: number;
  taxRate: number;
}

interface StepInfo {
  number: number;
  label: string;
}

@Component({
  selector: 'app-booking-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AiChatComponent],
  templateUrl: './booking-checkout.component.html',
  styleUrls: ['./booking-checkout.component.scss']
})
export class BookingCheckoutComponent implements OnInit {

  /* ══════════════════════════════════════════════
     NAVBAR
     ══════════════════════════════════════════════ */
  menuOpen = false;
  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }

  /* ══════════════════════════════════════════════
     PROGRESS STEPS
     ══════════════════════════════════════════════ */
  currentStep = 1;

  steps: StepInfo[] = [
    { number: 1, label: 'Guest Details' },
    { number: 2, label: 'Payment Info' },
    { number: 3, label: 'Review & Confirm' }
  ];

  /* ══════════════════════════════════════════════
     HOTEL DATA
     ══════════════════════════════════════════════ */
  hotel: BookingHotel = {
    name: 'Atlantis The Palm',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    stars: 5,
    reviewCount: 3842,
    ratingScore: 4.8,
    ratingLabel: 'Excellent',
    location: 'Palm Jumeirah, Dubai, UAE'
  };

  /* ══════════════════════════════════════════════
     BOOKING SUMMARY
     ══════════════════════════════════════════════ */
  booking: BookingSummary = {
    checkIn: 'May 10, 2026',
    checkOut: 'May 15, 2026',
    nights: 5,
    rooms: 1,
    adults: 2,
    pricePerNight: 180,
    taxRate: 0.12
  };

  get subtotal(): number {
    return this.booking.nights * this.booking.pricePerNight;
  }

  get taxes(): number {
    return Math.round(this.subtotal * this.booking.taxRate);
  }

  get total(): number {
    return this.subtotal + this.taxes;
  }

  /* ══════════════════════════════════════════════
     REACTIVE FORMS
     ══════════════════════════════════════════════ */
  guestForm!: FormGroup;
  billingForm!: FormGroup;

  countries: string[] = [
    'United Arab Emirates',
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'India',
    'Canada',
    'Australia',
    'Saudi Arabia',
    'Turkey'
  ];

  constructor(private fb: FormBuilder, private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.guestForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)]]
    });

    this.billingForm = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      saveInfo: [false]
    });
  }

  /* convenience getters */
  get f() { return this.guestForm.controls; }
  get b() { return this.billingForm.controls; }

  /* ══════════════════════════════════════════════
     ACTIONS
     ══════════════════════════════════════════════ */
  bookingLoading = false;
  bookingError = '';

  continueToPayment(): void {
    this.guestForm.markAllAsTouched();
    this.billingForm.markAllAsTouched();

    if (this.guestForm.valid && this.billingForm.valid) {
      this.currentStep = 2;
    }
  }

  proceedToReview(): void {
    this.currentStep = 3;
  }

  confirmBooking(): void {
    this.bookingLoading = true;
    this.bookingError = '';

    const arrivalDate = new Date(this.booking.checkIn);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

    const dto: CreateBookingDto = {
      hotel: this.hotel.name,
      guestName: this.guestForm.value.fullName,
      guestEmail: this.guestForm.value.email,
      phoneNumber: this.guestForm.value.phone,
      arrivalDateYear: arrivalDate.getFullYear(),
      arrivalDateMonth: monthNames[arrivalDate.getMonth()],
      arrivalDateDayOfMonth: arrivalDate.getDate(),
      adults: this.booking.adults,
      children: 0,
      babies: 0,
      meal: 'BB',
      country: this.billingForm.value.country?.substring(0, 3).toUpperCase() || 'UNK',
      reservedRoomType: 'A',
      depositType: 'No Deposit',
      adr: this.booking.pricePerNight
    };

    this.bookingService.create(dto).subscribe({
      next: () => {
        this.bookingLoading = false;
        this.currentStep = 4;
      },
      error: (err) => {
        this.bookingLoading = false;
        this.bookingError = 'Failed to confirm booking. Please try again.';
        console.error('Booking error:', err);
      }
    });
  }

  /* ══════════════════════════════════════════════
     HELPERS
     ══════════════════════════════════════════════ */
  starsArray(n: number): number[] { return Array(n).fill(0); }
  emptyStars(n: number): number[] { return Array(5 - n).fill(0); }

  private countWeekendNights(checkIn: Date, checkOut: Date): number {
    let count = 0;
    const current = new Date(checkIn);
    while (current < checkOut) {
      const day = current.getDay();
      if (day === 0 || day === 6) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  /* ── Chatbot ── */
  chatOpen = false;
  chatMode: 'preview' | 'chat' = 'preview';

  /* ── Footer ── */
  currentYear = new Date().getFullYear();
}
