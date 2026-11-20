import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HotelsComponent } from './hotels/hotels.component';
import { HotelResultsComponent } from './hotel-results/hotel-results.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { BookingCheckoutComponent } from './booking-checkout/booking-checkout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hotels', component: HotelsComponent },
  { path: 'hotel-results', component: HotelResultsComponent },
  { path: 'hotel-details', component: HotelDetailsComponent },
  { path: 'booking-checkout', component: BookingCheckoutComponent, canActivate: [authGuard] },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
