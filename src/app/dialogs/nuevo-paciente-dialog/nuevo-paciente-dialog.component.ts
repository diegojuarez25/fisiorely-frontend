import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ModuloAgendaService } from '../../../services/modulo-angeda.service';
@Component({
  selector: 'app-nuevo-paciente-dialog',
  templateUrl: './nuevo-paciente-dialog.component.html',
  styleUrls: ['./nuevo-paciente-dialog.component.css']
})
export class NuevoPacienteDialogComponent implements OnInit {
  pacienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NuevoPacienteDialogComponent>,
    private moduloAgendaService: ModuloAgendaService // Inyecta el servicio
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: [''],
      telefono: [''],
      edad: [''],
      estado: ['']
    });
  }

  ngOnInit(): void {
  }

  guardarPaciente(): void {
    if (this.pacienteForm.valid) {
      const datosPaciente = {
        nombre: this.pacienteForm.value.nombre,
        apellido_paterno: this.pacienteForm.value.apellidoPaterno,
        apellido_materno: this.pacienteForm.value.apellidoMaterno,
        telefono: this.pacienteForm.value.telefono,
        edad: this.pacienteForm.value.edad,
        estado: this.pacienteForm.value.estado
      };

      this.moduloAgendaService.guardarNuevoPaciente(datosPaciente).subscribe(
        () => {
          console.log('Paciente guardado correctamente');
          this.dialogRef.close();
        },
        error => {
          console.error('Error al guardar paciente:', error);
          // Manejo de errores según sea necesario
        }
      );
    } else {
      console.error('Formulario inválido');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}