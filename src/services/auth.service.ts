// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // URL de tu backend

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, credentials);
  }

  // Método para almacenar el token en el localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Método para obtener el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para eliminar el token del localStorage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // Método para almacenar el rol del usuario en el localStorage
  setRole(role: number): void {
    localStorage.setItem('role', role.toString());
  }

  // Método para obtener el rol del usuario del localStorage
  getUserRole(): number | null {
    const role = localStorage.getItem('role');
    return role ? Number(role) : null;
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
