import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AiChatComponent } from '../chatbot/ai-chat.component';

/* ── Interfaces ── */
interface HotelImage {
  url: string;
  alt: string;
}

interface Amenity {
  icon: string;
  name: string;
}

interface ReviewCategory {
  label: string;
  score: number;
}

interface Review {
  author: string;
  avatar: string;
  date: string;
  rating: number;
  title: string;
  text: string;
}

interface RoomType {
  name: string;
  image: string;
  size: string;
  beds: string;
  guests: number;
  price: number;
  perks: string[];
}

interface Hotel {
  name: string;
  stars: number;
  ratingScore: number;
  ratingLabel: string;
  reviewCount: number;
  location: string;
  mapUrl: string;
  description: string;
  highlights: string[];
  images: HotelImage[];
  amenities: Amenity[];
  reviewCategories: ReviewCategory[];
  reviews: Review[];
  rooms: RoomType[];
  pricePerNight: number;
  oldPrice?: number;
}

type TabId = 'overview' | 'amenities' | 'rooms' | 'reviews' | 'location';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AiChatComponent],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss']
})
export class HotelDetailsComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state as { hotel?: any } | undefined
      ?? (history.state as { hotel?: any });
    const passed = state?.hotel;
    if (passed) {
      this.hotel.name         = passed.name         ?? this.hotel.name;
      this.hotel.ratingScore  = passed.ratingScore  ?? this.hotel.ratingScore;
      this.hotel.ratingLabel  = passed.ratingLabel  ?? this.hotel.ratingLabel;
      this.hotel.reviewCount  = passed.reviews      ?? this.hotel.reviewCount;
      this.hotel.location     = passed.location     ?? this.hotel.location;
      this.hotel.pricePerNight = passed.price       ?? this.hotel.pricePerNight;
      this.hotel.oldPrice     = passed.oldPrice     ?? this.hotel.oldPrice;
      if (passed.image) {
        this.hotel.images = [
          { url: passed.image, alt: passed.name },
          ...this.hotel.images.slice(1)
        ];
      }
    }
  }

  /* ══════════════════════════════════════════════
     NAVBAR
     ══════════════════════════════════════════════ */
  menuOpen = false;
  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }

  /* ══════════════════════════════════════════════
     IMAGE GALLERY
     ══════════════════════════════════════════════ */
  selectedImageIndex = 0;

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  /* ══════════════════════════════════════════════
     TABS
     ══════════════════════════════════════════════ */
  activeTab: TabId = 'overview';

  tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'overview',  label: 'Overview',  icon: 'fa-solid fa-circle-info' },
    { id: 'amenities', label: 'Amenities', icon: 'fa-solid fa-concierge-bell' },
    { id: 'rooms',     label: 'Rooms',     icon: 'fa-solid fa-bed' },
    { id: 'reviews',   label: 'Reviews',   icon: 'fa-solid fa-star' },
    { id: 'location',  label: 'Location',  icon: 'fa-solid fa-map-location-dot' }
  ];

  switchTab(id: TabId): void {
    this.activeTab = id;
  }

  /* ══════════════════════════════════════════════
     BOOKING SIDEBAR
     ══════════════════════════════════════════════ */
  checkIn = '2026-05-10';
  checkOut = '2026-05-15';
  roomCount = 1;
  adultCount = 2;

  get nightCount(): number {
    const a = new Date(this.checkIn);
    const b = new Date(this.checkOut);
    const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }

  get totalPrice(): number {
    return this.hotel.pricePerNight * this.nightCount;
  }

  /* ══════════════════════════════════════════════
     HOTEL DATA
     ══════════════════════════════════════════════ */
  hotel: Hotel = {
    name: 'Atlantis The Palm',
    stars: 5,
    ratingScore: 4.8,
    ratingLabel: 'Excellent',
    reviewCount: 3842,
    location: 'Palm Jumeirah, Dubai, UAE',
    mapUrl: 'https://maps.google.com/?q=Atlantis+The+Palm+Dubai',
    description: `Atlantis The Palm is a luxurious oceanfront resort located on the crescent of
      Palm Jumeirah in Dubai. This iconic destination offers an unforgettable experience with
      its stunning architecture, world-class dining, and thrilling entertainment options.
      Featuring underwater suites with views of the Ambassador Lagoon, the resort is home
      to Aquaventure Waterpark — one of the largest in the world — and The Lost Chambers Aquarium.
      Whether you are seeking relaxation at ShuiQi Spa or adventure with dolphin encounters,
      Atlantis The Palm promises a truly extraordinary stay.`,
    highlights: [
      'Direct beach access on Palm Jumeirah',
      'Aquaventure Waterpark included',
      'The Lost Chambers Aquarium on-site',
      'Award-winning restaurants by celebrity chefs',
      'Underwater suites available',
      'Complimentary WiFi throughout'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80', alt: 'Hotel exterior view' },
      { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', alt: 'Luxury pool area' },
      { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80', alt: 'Beach front' },
      { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80', alt: 'Hotel lobby' },
      { url: 'https://images.unsplash.com/photo-1590490360182-c33d7d9d4f45?w=1200&q=80', alt: 'Deluxe room' },
      { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80', alt: 'Spa area' }
    ],
    amenities: [
      { icon: 'fa-solid fa-wifi',             name: 'Free WiFi' },
      { icon: 'fa-solid fa-umbrella-beach',   name: 'Beachfront' },
      { icon: 'fa-solid fa-water-ladder',     name: 'Outdoor Pool' },
      { icon: 'fa-solid fa-spa',              name: 'Spa & Wellness' },
      { icon: 'fa-solid fa-utensils',         name: 'Restaurant' },
      { icon: 'fa-solid fa-dumbbell',         name: 'Fitness Center' },
      { icon: 'fa-solid fa-square-parking',   name: 'Free Parking' },
      { icon: 'fa-solid fa-bell-concierge',   name: 'Concierge' },
      { icon: 'fa-solid fa-martini-glass',    name: 'Bar & Lounge' },
      { icon: 'fa-solid fa-children',         name: 'Kids Club' },
      { icon: 'fa-solid fa-shirt',            name: 'Laundry Service' },
      { icon: 'fa-solid fa-van-shuttle',      name: 'Airport Shuttle' }
    ],
    reviewCategories: [
      { label: 'Location',    score: 9.4 },
      { label: 'Cleanliness', score: 9.2 },
      { label: 'Service',     score: 9.0 },
      { label: 'Comfort',     score: 8.8 },
      { label: 'Value',       score: 8.5 }
    ],
    reviews: [
      {
        author: 'Sarah M.',
        avatar: 'S',
        date: 'Feb 2026',
        rating: 5,
        title: 'Absolutely breathtaking!',
        text: 'Our stay was nothing short of magical. The underwater suite was an experience of a lifetime and the staff went above and beyond.'
      },
      {
        author: 'James K.',
        avatar: 'J',
        date: 'Jan 2026',
        rating: 4,
        title: 'Great resort, worth the price',
        text: 'Beautiful property with amazing amenities. Aquaventure alone is worth the visit. Only downside was the crowded pool area on weekends.'
      },
      {
        author: 'Amira R.',
        avatar: 'A',
        date: 'Dec 2025',
        rating: 5,
        title: 'Perfect family vacation',
        text: 'Kids absolutely loved the waterpark and dolphin bay. The rooms are spacious and clean. Will definitely come back!'
      }
    ],
    rooms: [
      {
        name: 'Deluxe King Room',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d7d9d4f45?w=600&q=80',
        size: '45 m\u00B2',
        beds: '1 King Bed',
        guests: 2,
        price: 180,
        perks: ['Ocean View', 'Free WiFi', 'Breakfast Included']
      },
      {
        name: 'Premium Twin Room',
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80',
        size: '50 m\u00B2',
        beds: '2 Twin Beds',
        guests: 2,
        price: 195,
        perks: ['Palm View', 'Free WiFi', 'Minibar']
      },
      {
        name: 'Underwater Suite',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
        size: '85 m\u00B2',
        beds: '1 King Bed',
        guests: 3,
        price: 450,
        perks: ['Aquarium View', 'Butler Service', 'Spa Access', 'All Inclusive']
      }
    ],
    pricePerNight: 180,
    oldPrice: 220
  };

  /* ══════════════════════════════════════════════
     HELPERS
     ══════════════════════════════════════════════ */
  starsArray(n: number): number[] { return Array(n).fill(0); }
  emptyStars(n: number): number[] { return Array(5 - n).fill(0); }

  ratingBarWidth(score: number): string {
    return (score / 10 * 100) + '%';
  }

  /* ── Chatbot ── */
  chatOpen = false;
  chatMode: 'preview' | 'chat' = 'preview';

  get hotelContext(): string {
    return `User is viewing hotel: "${this.hotel.name}", located at ${this.hotel.location}, ` +
      `${this.hotel.stars} stars, rated ${this.hotel.ratingScore}/10 ("${this.hotel.ratingLabel}"), ` +
      `from $${this.hotel.pricePerNight}/night. ${this.hotel.description.slice(0, 200)}`;
  }

  /* ── Footer ── */
  currentYear = new Date().getFullYear();
}
