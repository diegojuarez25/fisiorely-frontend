import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalidadService {
  private apiUrl = 'http://localhost:3000/api/modalidad';

  constructor(private http: HttpClient) {}

  obtenerModalidades(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  obtenerModalidadPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  agregarModalidad(modalidad: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, modalidad);
  }

  actualizarModalidad(id: number, modalidad: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, modalidad);
  }

  eliminarModalidad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
