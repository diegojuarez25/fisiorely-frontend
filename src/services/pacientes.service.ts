import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:3000/api/pacientes';


  constructor(private http: HttpClient) { }

  getPacientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getPacienteById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  agregarPaciente(paciente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, paciente);
  }
  

  actualizarPaciente(id: number, paciente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paciente);
  }

  eliminarPaciente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
