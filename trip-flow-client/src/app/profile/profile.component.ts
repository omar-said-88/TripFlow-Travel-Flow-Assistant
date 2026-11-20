import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BookingService, BookingDto } from '../services/booking.service';
import { AiChatComponent } from '../chatbot/ai-chat.component';

/* ── Sidebar nav item ── */
interface SidebarItem {
  icon: string;
  label: string;
  key: string;
}

/* ── Country code ── */
interface CountryCode {
  code: string;
  dial: string;
  flag: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AiChatComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  /* ══════════════════════════════════════════════
     NAVBAR
     ══════════════════════════════════════════════ */
  mobileMenuOpen = false;
  avatarDropdownOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleAvatarDropdown(): void {
    this.avatarDropdownOpen = !this.avatarDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /* ══════════════════════════════════════════════
     SIDEBAR
     ══════════════════════════════════════════════ */
  activeSection = 'account';
  mobileSidebarOpen = false;

  sidebarItems: SidebarItem[] = [
    { icon: 'fa-solid fa-gear',           label: 'Account Settings',    key: 'account' },
    { icon: 'fa-solid fa-suitcase',       label: 'My Bookings',         key: 'bookings' },
    { icon: 'fa-solid fa-heart',          label: 'Saved Destinations',  key: 'saved' },
    { icon: 'fa-solid fa-headset',        label: 'Support',             key: 'support' }
  ];

  setActiveSection(key: string): void {
    this.activeSection = key;
    this.mobileSidebarOpen = false;
    if (key === 'bookings' && this.myBookings.length === 0 && !this.bookingsLoading) {
      this.loadMyBookings();
    }
  }

  /* ══════════════════════════════════════════════
     USER DATA (from AuthService)
     ══════════════════════════════════════════════ */
  user = {
    fullName: '',
    email: '',
    phone: '',
    phoneCode: '+1',
    nationality: 'US',
    avatarUrl: '',
    memberSince: ''
  };

  /* ══════════════════════════════════════════════
     MY BOOKINGS
     ══════════════════════════════════════════════ */
  myBookings: BookingDto[] = [];
  bookingsLoading = false;
  bookingsError = '';

  loadMyBookings(): void {
    this.bookingsLoading = true;
    this.bookingsError = '';
    this.bookingService.getAll({ page: 1, pageSize: 10 }).subscribe({
      next: (result) => {
        this.myBookings = result.data;
        this.bookingsLoading = false;
      },
      error: (err) => {
        this.bookingsError = 'Failed to load bookings.';
        this.bookingsLoading = false;
        console.error('Bookings error:', err);
      }
    });
  }

  /* ══════════════════════════════════════════════
     COUNTRY CODES
     ══════════════════════════════════════════════ */
  countryCodes: CountryCode[] = [
    { code: 'US', dial: '+1',   flag: '🇺🇸' },
    { code: 'GB', dial: '+44',  flag: '🇬🇧' },
    { code: 'AE', dial: '+971', flag: '🇦🇪' },
    { code: 'SD', dial: '+249', flag: '🇸🇩' },
    { code: 'EG', dial: '+20',  flag: '🇪🇬' },
    { code: 'SA', dial: '+966', flag: '🇸🇦' },
    { code: 'TR', dial: '+90',  flag: '🇹🇷' },
    { code: 'IN', dial: '+91',  flag: '🇮🇳' },
    { code: 'DE', dial: '+49',  flag: '🇩🇪' },
    { code: 'FR', dial: '+33',  flag: '🇫🇷' }
  ];

  /* ── Nationalities ── */
  nationalities: { code: string; name: string }[] = [
    { code: 'SD', name: 'Sudanese' },
    { code: 'US', name: 'American' },
    { code: 'GB', name: 'British' },
    { code: 'AE', name: 'Emirati' },
    { code: 'EG', name: 'Egyptian' },
    { code: 'SA', name: 'Saudi' },
    { code: 'TR', name: 'Turkish' },
    { code: 'IN', name: 'Indian' },
    { code: 'DE', name: 'German' },
    { code: 'FR', name: 'French' }
  ];

  /* ══════════════════════════════════════════════
     FORMS
     ══════════════════════════════════════════════ */
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  /* profile form helpers */
  get pf() { return this.profileForm.controls; }

  /* password form helpers */
  get pw() { return this.passwordForm.controls; }

  /* ── Password visibility toggles ── */
  currentPwVisible = false;
  newPwVisible = false;
  confirmPwVisible = false;

  toggleCurrentPw(): void { this.currentPwVisible  = !this.currentPwVisible;  }
  toggleNewPw(): void     { this.newPwVisible      = !this.newPwVisible;      }
  toggleConfirmPw(): void { this.confirmPwVisible  = !this.confirmPwVisible;  }

  /* ── Save profile ── */
  profileSaved = false;

  onSaveProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      console.log('Profile saved:', this.profileForm.value);
      this.profileSaved = true;
      setTimeout(() => (this.profileSaved = false), 3000);
    }
  }

  /* ── Update password ── */
  passwordUpdated = false;

  onUpdatePassword(): void {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.valid) {
      console.log('Password updated:', this.passwordForm.value);
      this.passwordUpdated = true;
      this.passwordForm.reset();
      setTimeout(() => (this.passwordUpdated = false), 3000);
    }
  }

  /* ── Custom validator — passwords match ── */
  static passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const newPw    = group.get('newPassword')?.value;
    const confirm  = group.get('confirmPassword')?.value;
    if (newPw && confirm && newPw !== confirm) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  /* ══════════════════════════════════════════════
     CHATBOT
     ══════════════════════════════════════════════ */
  chatOpen = false;
  chatMode: 'preview' | 'chat' = 'preview';

  /* ── Footer ── */
  currentYear = new Date().getFullYear();

  /* ══════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════ */
  constructor(private fb: FormBuilder, private authService: AuthService, private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    /* ── Populate user from AuthService ── */
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user.email    = currentUser.username;
      this.user.fullName = currentUser.username;
      this.user.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&size=200&background=2563eb&color=fff&bold=true`;
    }

    /* ── Profile form ── */
    this.profileForm = this.fb.group({
      fullName:    [this.user.fullName,  [Validators.required, Validators.minLength(3)]],
      email:       [this.user.email,     [Validators.required, Validators.email]],
      phoneCode:   [this.user.phoneCode, [Validators.required]],
      phone:       [this.user.phone,     [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      nationality: [this.user.nationality]
    });

    /* ── Password form ── */
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword:     ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: ProfileComponent.passwordsMatch });
  }
}
