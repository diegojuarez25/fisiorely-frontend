import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoConsultaService {
  private apiUrl = 'http://localhost:3000/api/tipoConsulta'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

  getTiposConsulta(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  getTipoConsulta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  agregarTipoConsulta(descripcion: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, { descripcion });
  }

  actualizarTipoConsulta(id: number, descripcion: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { descripcion });
  }

  eliminarTipoConsulta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
