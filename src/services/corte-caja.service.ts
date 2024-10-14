import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorteCajaService {

  private baseUrl = 'http://localhost:3000/api/corte-caja'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  obtenerCortesCaja(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  obtenerCorteCajaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  realizarCorteCaja(corteData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, corteData);
  }

  eliminarCorteCaja(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // Aquí puedes agregar más métodos según sea necesario, por ejemplo, para actualizar cortes de caja, etc.
}
