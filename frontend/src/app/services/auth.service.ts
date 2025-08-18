import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Check if user is logged in on service initialization
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('currentUser');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
        } catch (error) {
          this.logout();
        }
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/v1/users/login`, credentials)
      .pipe(
        tap(response => {
          if (response.status_code === 200 && response.data && isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify({ username: credentials.username }));
            this.currentUserSubject.next({ username: credentials.username } as any);
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    const formData = new FormData();
    formData.append('username', userData.email); // Backend expects 'username', we use email as username
    formData.append('password', userData.password);
    
    if (userData.avatar) {
      formData.append('profile_img', userData.avatar); // Backend expects 'profile_img'
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/api/v1/users/`, formData)
      .pipe(
        tap(response => {
          if (response.status_code === 201 && response.data && isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify({ username: userData.email }));
            this.currentUserSubject.next({ username: userData.email } as any);
          }
        })
      );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getAuthHeadersForFormData(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
}
