import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_BASE_V1 } from '../config/api.config';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = API_BASE_V1;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}auth/login`, { username, password }).pipe(
      catchError((error) => { throw error; })
    );
  }

  register(email: string, password: string): Observable<AuthResponse> {
    const payload = { username: email, password };
    return this.http.post<AuthResponse>(`${this.baseUrl}auth/register`, payload).pipe(
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
