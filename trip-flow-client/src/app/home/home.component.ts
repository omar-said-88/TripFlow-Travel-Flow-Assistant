import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AiChatComponent } from '../chatbot/ai-chat.component';

interface Destination {
  name: string;
  tag: string;
  image: string;
}

interface Reason {
  icon: string;
  title: string;
  text: string;
}

interface MiniOffer {
  icon: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AiChatComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.css.scss']
})
export class HomeComponent {

  /* ── Navbar ── */
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  constructor(private router: Router) {}

  /* ── Hero search ── */
  destination = '';
  checkIn = '';
  checkOut = '';
  budget = '';

  search(): void {
    this.router.navigate(['/hotel-results'], {
      queryParams: {
        destination: this.destination.trim(),
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        budget: this.budget
      }
    });
  }

  /* ── Popular Destinations ── */
  destinations: Destination[] = [
    {
      name: 'Paris',
      tag: 'City of Light',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80'
    },
    {
      name: 'Dubai',
      tag: 'Luxury & Adventure',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80'
    },
    {
      name: 'Maldives',
      tag: 'Tropical Paradise',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80'
    },
    {
      name: 'Istanbul',
      tag: 'East Meets West',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80'
    }
  ];

  /* ── Why Choose TripFlow ── */
  reasons: Reason[] = [
    {
      icon: 'fa-solid fa-headset',
      title: '24/7 Customer Support',
      text: 'Our dedicated support team is always available to assist you at every step of your journey.'
    },
    {
      icon: 'fa-solid fa-wand-magic-sparkles',
      title: 'Easy Booking Process',
      text: 'Book flights, hotels, and activities in just a few clicks with our streamlined platform.'
    },
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Best Price Guarantee',
      text: 'We match any competitor\'s price so you always get the best deal on your travels.'
    }
  ];

  /* ── Mini offers ── */
  miniOffers: MiniOffer[] = [
    {
      icon: 'fa-solid fa-plane-departure',
      title: 'Flight + Hotel Bundles',
      desc: 'Save up to 20% when you bundle'
    },
    {
      icon: 'fa-solid fa-percent',
      title: 'Early Bird Discounts',
      desc: 'Book 60 days ahead & save 15%'
    }
  ];

  /* ── Chatbot ── */
  chatOpen = false;
  chatMode: 'preview' | 'chat' = 'preview';

  /* ── Footer ── */
  currentYear = new Date().getFullYear();
}
