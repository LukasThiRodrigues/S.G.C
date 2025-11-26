import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment.development';

export interface User {
  id: number;
  nome: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Login
  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  // Registro
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  findOne(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  private setSession(response: any): void {
    try {
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.warn('LocalStorage não disponível:', error);
    }
  }

  logout(): void {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.warn('Erro ao limpar storage:', error);
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  getCurrentUser(): any {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded;
    }

    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}