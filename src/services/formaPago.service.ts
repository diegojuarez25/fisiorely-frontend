import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {
  private apiUrl = 'http://localhost:3000/api/formaPago';

  constructor(private http: HttpClient) {}

  obtenerFormasPago(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  obtenerFormaPagoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  agregarFormaPago(formaPago: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formaPago);
  }

  actualizarFormaPago(id: number, formaPago: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formaPago);
  }

  eliminarFormaPago(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
