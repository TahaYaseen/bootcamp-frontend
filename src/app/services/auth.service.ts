import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://voice-backend.onrender.com/api/v1/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}auth/login`, { username, password }).pipe(
      catchError((error) => { throw error; })
    );
  }

  register(email: string, password: string): Observable<AuthResponse> {
    const payload = { username: email, password };
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/v1/auth/register`, payload).pipe(
      catchError((error) => { throw error; })
    );
  }

  logout(): void {
    const token = sessionStorage.getItem('jwt');
    if (token) {
      this.http.post(`${this.baseUrl}auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe(() => {
          sessionStorage.removeItem('jwt');
          window.location.href = '/login';
        });
    } else {
      window.location.href = '/login';
    }
  }

  saveToken(token: string): void {
    sessionStorage.setItem('jwt', token);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('jwt');
    }
    return false;
  }
}
