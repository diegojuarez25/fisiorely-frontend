import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModuloAgendaService {
  private apiUrl = 'http://localhost:3000/api'; // Reemplaza con la URL de tu API real

  constructor(private http: HttpClient) { }

  getTipoConsulta(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipoConsulta`).pipe(
      catchError(error => {
        console.error('Error al obtener tipos de consulta:', error);
        return throwError(error);
      })
    );
  }
  getModalidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/modalidad`).pipe(
      catchError(error => {
        console.error('Error al obtener modalidades:', error);
        return throwError(error);
      })
    );
  }
  getPacientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pacientes`).pipe(
      catchError(error => {
        console.error('Error al obtener pacientes:', error);
        return throwError(error);
      })
    );
  }

  getConsultas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consultas`).pipe(
      map((consultas: any[]) => {
        // Ordenar consultas por fecha descendente
        return consultas.sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime());
      }),
      catchError(error => {
        console.error('Error al obtener consultas:', error);
        return throwError(error);
      })
    );
  }
  

  getConsultaById(id: number): Observable<any> {
    // Ajusta el endpoint según la estructura de tu API para obtener solo los datos necesarios
    return this.http.get<any>(`${this.apiUrl}/consultas/${id}?fields=tipo_consulta,paciente.nombre,paciente.apellido_paterno,paciente.apellido_materno,modalidad`).pipe(
      catchError(error => {
        console.error(`Error al obtener consulta con id=${id}:`, error);
        return throwError(error);
      })
    );
  }

  createConsulta(consulta: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/consultas`, consulta);
  }

  updateConsulta(id: number, consulta: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/consultas/${id}`, consulta).pipe(
      catchError(error => {
        console.error(`Error al actualizar consulta con id=${id}:`, error);
        return throwError(error);
      })
    );
  }
  

  deleteConsulta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/consultas/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar consulta:', error);
        return throwError(error);
      })
    );
  }

  guardarNuevoPaciente(datosPaciente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pacientes`, datosPaciente).pipe(
      catchError(error => {
        console.error('Error al guardar nuevo paciente:', error);
        return throwError(error);
      })
    );
  }
}