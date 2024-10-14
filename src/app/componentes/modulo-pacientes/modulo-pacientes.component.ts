import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../../services/pacientes.service';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-modulo-pacientes',
  templateUrl: './modulo-pacientes.component.html',
  styleUrls: ['./modulo-pacientes.component.css']
})
export class ModuloPacientesComponent implements OnInit, AfterViewInit {
  pacientes: any[] = [];
  pacienteForm: FormGroup;
  filteredPacientes: any[] = [];
  pacienteSeleccionado: any = null;
  pageSize = 6;
  pageIndex = 0;
  pacientesOriginales: any[] = []; // Lista completa de pacientes

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private pacienteService: PacienteService,
    private fb: FormBuilder
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: [''],
      telefono: ['', Validators.required],
      edad: ['', Validators.required],
      estado: ['En tratamiento', Validators.required] // Valor por defecto
    });
  }

  ngOnInit(): void {
    this.cargarPacientes();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => this.updatePagedData());
    }
  }

  cargarPacientes(): void {
    this.pacienteService.getPacientes().subscribe(
      data => {
        this.pacientesOriginales = data;
        this.pacientes = [...this.pacientesOriginales];
        this.filteredPacientes = [...this.pacientes];
        this.updatePagedData(); // Actualiza los datos paginados después de cargar
      },
      error => {
        console.error('Error cargando pacientes', error);
      }
    );
  }
  
  guardarPaciente(): void {
    if (this.pacienteSeleccionado) {
      this.pacienteService.actualizarPaciente(this.pacienteSeleccionado.id, this.pacienteForm.value).subscribe(
        () => {
          this.cargarPacientes();
          this.resetearFormulario();
          this.pacienteSeleccionado = null;
        },
        error => console.error('Error actualizando paciente', error)
      );
    } else {
      if (this.pacienteForm.valid) {
        this.pacienteService.agregarPaciente(this.pacienteForm.value).subscribe(
          () => {
            this.cargarPacientes();
            this.resetearFormulario();
          },
          error => console.error('Error creando paciente', error)
        );
      }
    }
  }
  
  actualizarPaciente(paciente: any): void {
    this.pacienteSeleccionado = paciente;
    this.pacienteForm.patchValue(paciente);
    window.scrollTo(0, 0); // Esto llevará al inicio de la página
  }

  eliminarPaciente(id: number): void {
    const confirmarEliminar = confirm('¿Seguro que quieres eliminar este paciente?');
    if (confirmarEliminar) {
      this.pacienteService.eliminarPaciente(id).subscribe(
        () => {
          this.cargarPacientes();
        },
        error => {
          console.error('Error eliminando paciente', error);
        }
      );
    }
  }

  resetearFormulario(): void {
    this.pacienteForm.reset();
    this.pacienteSeleccionado = null;
  }

  aplicarFiltro(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const valor = inputElement.value.trim().toLowerCase();

    if (valor) {
      this.filteredPacientes = this.pacientesOriginales.filter(paciente =>
        paciente.nombre.toLowerCase().includes(valor)
      );
    } else {
      this.filteredPacientes = [...this.pacientesOriginales];
    }
    this.updatePagedData(); // Actualiza los datos paginados después de aplicar el filtro
  }

  updatePagedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pacientes = this.filteredPacientes.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData(); // Actualiza los datos paginados cuando cambie la página
  }
}
