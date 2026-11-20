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
import { AiChatComponent } from '../chatbot/ai-chat.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AiChatComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  /* ── Form ── */
  registerForm!: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;
  loading = false;
  error = '';

  get f() { return this.registerForm.controls; }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPassword(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onRegister(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';

    const { email, password } = this.registerForm.value;

    this.authService.register({ username: email, password }).subscribe({
      next: () => {
        // Auto-login after registration
        this.authService.login({ username: email, password }).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/profile']);
          },
          error: () => {
            this.loading = false;
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed. Please try again.';
        console.error('Register error:', err);
      }
    });
  }

  /* ── Custom validator — passwords match ── */
  static passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm  = group.get('confirmPassword')?.value;
    if (password && confirm && password !== confirm) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  /* ── Init ── */
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName:        ['', [Validators.required, Validators.minLength(3)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: RegisterComponent.passwordsMatch });
  }

  /* ── Chatbot ── */
  chatOpen = false;
  chatMode: 'preview' | 'chat' = 'preview';
}
