import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, AuthResponse } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should POST to /auth/login and store token', () => {
      const mockResponse: AuthResponse = { token: 'jwt-token', username: 'alice', role: 'User' };

      service.login({ username: 'alice', password: 'secret' }).subscribe(res => {
        expect(res.token).toBe('jwt-token');
        expect(localStorage.getItem('auth_token')).toBe('jwt-token');
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'alice', password: 'secret' });
      req.flush(mockResponse);
    });

    it('should update currentUser$ after login', () => {
      const mockResponse: AuthResponse = { token: 'jwt-token', username: 'alice', role: 'User' };

      service.login({ username: 'alice', password: 'secret' }).subscribe();
      httpMock.expectOne(`${apiUrl}/auth/login`).flush(mockResponse);

      service.currentUser$.subscribe(user => {
        expect(user?.username).toBe('alice');
      });
    });
  });

  describe('register()', () => {
    it('should POST to /auth/register', () => {
      service.register({ username: 'bob', password: 'pass123' }).subscribe(res => {
        expect(res).toBe('User registered successfully.');
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush('User registered successfully.');
    });
  });

  describe('logout()', () => {
    it('should clear storage and reset currentUser$', () => {
      localStorage.setItem('auth_token', 'some-token');
      localStorage.setItem('user', JSON.stringify({ token: 'x', username: 'alice', role: 'User' }));

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('isAuthenticated()', () => {
    it('should return false when no token', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'some-token');
      expect(service.isAuthenticated()).toBeTrue();
    });
  });

  describe('isAdmin()', () => {
    it('should return false for non-admin user', () => {
      localStorage.setItem('user', JSON.stringify({ token: 'x', username: 'alice', role: 'User' }));
      expect(service.isAdmin()).toBeFalse();
    });

    it('should return true for admin user', () => {
      localStorage.setItem('user', JSON.stringify({ token: 'x', username: 'admin', role: 'Admin' }));
      expect(service.isAdmin()).toBeTrue();
    });
  });
});
