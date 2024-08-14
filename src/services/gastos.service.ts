import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  private apiUrl = 'http://localhost:3000/api/gastos';

  constructor(private http: HttpClient) {}

  obtenerGastos(): Observable<any> {
    return this.http.get(`${this.apiUrl}?forma_pago`);
  }

  obtenerGastoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  agregarGasto(gasto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, gasto);
  }

  actualizarGasto(id: number, gasto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, gasto);
  }

  eliminarGasto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
