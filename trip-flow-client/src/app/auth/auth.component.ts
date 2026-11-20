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
import { RouterModule } from '@angular/router';
import { AiChatComponent } from '../chatbot/ai-chat.component';

type AuthTab = 'login' | 'register';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AiChatComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  /* ══════════════════════════════════════════════
     TAB STATE
     ══════════════════════════════════════════════ */
  activeTab: AuthTab = 'login';

  switchTab(tab: AuthTab): void {
    this.activeTab = tab;
  }

  /* ══════════════════════════════════════════════
     LOGIN FORM
     ══════════════════════════════════════════════ */
  loginForm!: FormGroup;
  loginPasswordVisible = false;

  get lf() { return this.loginForm.controls; }

  toggleLoginPassword(): void {
    this.loginPasswordVisible = !this.loginPasswordVisible;
  }

  onLogin(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      console.log('Login:', this.loginForm.value);
    }
  }

  /* ══════════════════════════════════════════════
     REGISTER FORM
     ══════════════════════════════════════════════ */
  registerForm!: FormGroup;
  registerPasswordVisible = false;
  confirmPasswordVisible = false;

  get rf() { return this.registerForm.controls; }

  toggleRegisterPassword(): void {
    this.registerPasswordVisible = !this.registerPasswordVisible;
  }

  toggleConfirmPassword(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onRegister(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      console.log('Register:', this.registerForm.value);
    }
  }

  /* ══════════════════════════════════════════════
     CUSTOM VALIDATOR — password match
     ══════════════════════════════════════════════ */
  static passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (password && confirm && password !== confirm) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  /* ══════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════ */
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: AuthComponent.passwordsMatch });
  }

  /* ══════════════════════════════════════════════
     CHATBOT
     ══════════════════════════════════════════════ */
  chatOpen = false;
  chatMode: 'preview' | 'chat' = 'preview';
}
