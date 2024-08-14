// servicios/tipo-ingreso.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoIngresoService {
  private apiUrl = 'http://localhost:3000/api/tipoIngreso';

  constructor(private http: HttpClient) { }

  obtenerTiposIngreso(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
