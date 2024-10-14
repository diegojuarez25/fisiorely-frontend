// Servicio de Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  private apiUrl = 'http://localhost:3000/api/ingresos';

  constructor(private http: HttpClient) { }

  obtenerIngresos(): Observable<any> {
    // Incluye los datos relacionados al recuperar los ingresos
    return this.http.get(`${this.apiUrl}?include=tipo_ingreso,forma_pago,paciente,modalidad`);
  }

  obtenerIngresoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  agregarIngreso(ingreso: any): Observable<any> {
    // Asegura que el objeto de ingreso tenga el formato correcto antes de enviarlo al servidor
    const body = {
      tipo_ingreso_id: ingreso.tipo_ingreso_id,
      fecha_inicio: ingreso.fecha_inicio,
      fecha_fin: ingreso.fecha_fin,
      paciente_id: ingreso.paciente_id,
      forma_pago_id: ingreso.forma_pago_id,
      monto: ingreso.monto,
      persona_que_atendio: ingreso.persona_que_atendio,
      modalidad_id: ingreso.modalidad_id
    };
    return this.http.post(this.apiUrl, body);
  }

  actualizarIngreso(id: number, ingreso: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ingreso);
  }

  eliminarIngreso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  obtenerIngresosConFiltros(filtros: any): Observable<any[]> {
    let url = `${this.apiUrl}`;

    // Construye la URL con parámetros de filtro si existen
    if (filtros.fechaInicio && filtros.fechaFin) {
      url += `?fechaInicio=${filtros.fechaInicio}&fechaFin=${filtros.fechaFin}`;
    }
    if (filtros.tipoIngreso) {
      url += `&tipoIngreso=${filtros.tipoIngreso}`;
    }
    if (filtros.modalidad) {
      url += `&modalidad=${filtros.modalidad}`;
    }

    // Realiza la llamada HTTP GET
    return this.http.get<any[]>(url);
  }
}
