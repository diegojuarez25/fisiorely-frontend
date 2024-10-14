import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ModuloAgendaService } from '../../../services/modulo-angeda.service';
import { NuevoPacienteDialogComponent } from '../../dialogs/nuevo-paciente-dialog/nuevo-paciente-dialog.component';

@Component({
  selector: 'app-modulo-agenda',
  templateUrl: './modulo-agenda.component.html',
  styleUrls: ['./modulo-agenda.component.css']
})
export class ModuloAgendaComponent implements OnInit {
  consultaForm: FormGroup;
  pacientes: any[] = [];
  consultas: any[] = [];
  tipoConsultaOptions: any[] = [];
  modalidadOptions: any[] = [];
  filteredPacientesOptions!: Observable<any[]>;
  paginatedConsultas: any[] = [];
  showPadecimiento: boolean = false;
  isEditing: boolean = false;
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  consulta: any = null; // Propiedad para la consulta actual en edición
  selectedDateTime: Date | null = null;


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private moduloAgendaService: ModuloAgendaService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<ModuloAgendaComponent>
  ) {
    this.consultaForm = this.fb.group({
      tipoConsulta: [null, Validators.required],
      pacienteInput: ['', Validators.required],
      padecimiento: [''],
      telefono: ['', Validators.required],
      edad: ['', Validators.required],
      modalidad: [null, Validators.required],
      fechaInicio: ['', [Validators.required, this.fechaInicioValidator.bind(this)]],
      paciente_id: [null, Validators.required]
    });
     // Si hay datos, establece la fecha y hora seleccionadas
     if (data && data.selectedDateTime) {
      this.selectedDateTime = data.selectedDateTime;
  }
}

  ngOnInit() {
    this.loadConsultas();
    this.loadPacientes();
    this.loadTipoConsultaOptions().subscribe(() => {
      this.loadModalidadOptions().subscribe(() => {
        this.setupPacienteFilter();
        this.setupTipoConsultaChange();

        // Manejar edición si hay datos
        if (this.data && this.data.consultaId) {
          this.isEditing = true;
          this.loadConsultaForEdit(this.data.consultaId);
        }
         // Si hay una fecha y hora seleccionadas, actualiza el formulario
         if (this.selectedDateTime) {
          this.consultaForm.patchValue({
            fechaInicio: this.selectedDateTime
          })
        }
      });
    });
  }

  // ...

  onSubmit() {
    if (this.consultaForm.valid) {
      const consulta = {
        tipo_consulta_id: this.consultaForm.value.tipoConsulta,
        modalidad_id: this.consultaForm.value.modalidad,
        paciente_id: this.consultaForm.value.paciente_id,
        padecimiento: this.consultaForm.value.padecimiento,
        telefono: this.consultaForm.value.telefono,
        edad: this.consultaForm.value.edad,
        fecha_inicio: moment(this.consultaForm.value.fechaInicio).format('YYYY-MM-DD HH:mm:ss')
      };

    

      if (this.isEditing) {
        const consultaId = this.consulta.id; // Asegúrate de que 'consulta' tenga un 'id' válido
        this.moduloAgendaService.updateConsulta(consultaId, consulta).subscribe(
          () => {
            this.snackBar.open('Consulta actualizada con éxito', 'Cerrar', { duration: 2000 });
            this.resetForm();
            this.loadConsultas();
            if (this.dialogRef) {
              this.dialogRef.close(); // Cerrar el diálogo si está en modo de diálogo
            }
          },
          error => {
            console.error('Error al actualizar consulta:', error);
            this.snackBar.open('Error al actualizar consulta', 'Cerrar', { duration: 2000 });
          }
        );
      } else {
        this.moduloAgendaService.createConsulta(consulta).subscribe(
          () => {
            this.snackBar.open('Consulta creada con éxito', 'Cerrar', { duration: 2000 });
            this.resetForm();
            this.loadConsultas();
            if (this.dialogRef) {
              this.dialogRef.close(); // Cerrar el diálogo si está en modo de diálogo
            }
          },
          error => {
            console.error('Error al crear consulta:', error);
            this.snackBar.open('Error al crear consulta', 'Cerrar', { duration: 2000 });
          }
        );
      }
    } else {
      console.error('Formulario inválido');
      this.snackBar.open('Rellena todos los campos del formulario', 'Cerrar', { duration: 2000 });
    }
  }
  
  loadConsultaForEdit(consultaId: number) {
    this.moduloAgendaService.getConsultaById(consultaId).subscribe((consulta) => {
      this.consulta = consulta;
      this.consultaForm.patchValue({
        tipoConsulta: consulta.tipo_consulta_id,
        pacienteInput: consulta.paciente_id, // Asegúrate de que paciente_id se ajuste aquí
        padecimiento: consulta.padecimiento,
        telefono: consulta.telefono,
        edad: consulta.edad,
        modalidad: consulta.modalidad_id,
        fechaInicio: consulta.fecha_inicio
      });
  
      this.updatePadecimientoVisibility(this.consultaForm.value.tipoConsulta);
  
      // Scroll hacia el formulario
      window.scrollTo(0, 0); // Esto llevará al inicio de la página
    });
  }
    // Validador personalizado para fecha de inicio
  fechaInicioValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value) {
      const today = moment().startOf('day'); // Fecha de hoy a las 00:00 horas
      const selectedDate = moment(control.value);
      if (selectedDate.isBefore(today)) {
        return { 'fechaAnterior': true }; // Retorna un error si la fecha seleccionada es anterior a hoy
      }
    }
    return null;
  }

  // Función para verificar duplicados
  private isDuplicateDateTime(newConsulta: any): boolean {
    return this.consultas.some(consulta =>
      moment(consulta.fecha_inicio).isSame(moment(newConsulta.fecha_inicio), 'minute')
    );
  }

  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  // Método para generar el rango de páginas dinámico
  getDynamicPageRange(): number[] {
    const rangeStart = Math.max(1, this.currentPage - 1);
    const rangeEnd = Math.min(this.totalPages, this.currentPage + 1);
    return Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);
  }

  private loadConsultas() {
    this.moduloAgendaService.getConsultas().subscribe(
      (data: any[]) => {
        this.consultas = data;
        this.totalPages = Math.ceil(this.consultas.length / this.pageSize);
        this.updatePaginatedConsultas();
      },
      error => {
        console.error('Error al obtener consultas:', error);
      }
    );
  }

  private loadPacientes() {
    this.moduloAgendaService.getPacientes().subscribe(
      (data: any[]) => {
        this.pacientes = data;
      },
      error => {
        console.error('Error al obtener pacientes:', error);
      }
    );
  }

  private loadTipoConsultaOptions(): Observable<any> {
    return this.moduloAgendaService.getTipoConsulta().pipe(
      map((data: any[]) => {
        this.tipoConsultaOptions = data;
      })
    );
  }

  private loadModalidadOptions(): Observable<any> {
    return this.moduloAgendaService.getModalidades().pipe(
      map((data: any[]) => {
        this.modalidadOptions = data;
      })
    );
  }

  private setupPacienteFilter() {
    this.filteredPacientesOptions = this.consultaForm.get('pacienteInput')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : '')),
      map(value => this.filterPacientes(value))
    );
  }

  private setupTipoConsultaChange() {
    this.consultaForm.get('tipoConsulta')!.valueChanges.subscribe(value => {
      this.updatePadecimientoVisibility(value);
    });
  }

  private updatePadecimientoVisibility(tipoConsulta: number) {
    this.showPadecimiento = tipoConsulta === 1; // Ajustar según el valor correcto para mostrar padecimiento
    if (this.showPadecimiento) {
      this.consultaForm.get('padecimiento')!.setValidators([Validators.required]);
    } else {
      this.consultaForm.get('padecimiento')!.clearValidators();
    }
    this.consultaForm.get('padecimiento')!.updateValueAndValidity();
  }

  private filterPacientes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.pacientes.filter(paciente =>
      `${paciente.nombre} ${paciente.apellido_paterno} ${paciente.apellido_materno}`.toLowerCase().includes(filterValue)
    );
  }

  abrirDialogoNuevoPaciente() {
    const dialogRef = this.dialog.open(NuevoPacienteDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.moduloAgendaService.guardarNuevoPaciente(result).subscribe(
          () => {
            this.snackBar.open('Paciente creado con éxito', 'Cerrar', { duration: 2000 });
            this.loadPacientes();
          },
          error => {
            console.error('Error al guardar nuevo paciente:', error);
            this.snackBar.open('Error al guardar nuevo paciente', 'Cerrar', { duration: 2000 });
          }
        );
      }
    });
  }

  onPacienteSelected(paciente: any) {
    this.consultaForm.patchValue({
      pacienteInput: `${paciente.nombre} ${paciente.apellido_paterno}`, // Mostrar nombre completo
      edad: paciente.edad,
      telefono: paciente.telefono,
      modalidad: paciente.modalidad_id,
      paciente_id: paciente.id // Guardar el ID del paciente para enviar al backend
    });

}

  // Método para cambiar de página
  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedConsultas(); // Actualiza las consultas paginadas
    }
  }

  updatePaginatedConsultas() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedConsultas = this.consultas.slice(startIndex, startIndex + this.pageSize);
  }

  resetForm() {
    this.consultaForm.reset();
    this.isEditing = false;
    this.consulta = null; // Limpiar la propiedad de consulta actual
  }

  onDelete(id: number): void {
    const confirmDelete = confirm('¿Seguro que quieres eliminar esta consulta?');

    if (confirmDelete) {
      this.moduloAgendaService.deleteConsulta(id).subscribe(
        () => {
          this.snackBar.open('Consulta eliminada con éxito', 'Cerrar', { duration: 2000 });
          this.loadConsultas();
        },
        error => {
          console.error('Error al eliminar consulta:', error);
          this.snackBar.open('Error al eliminar consulta', 'Cerrar', { duration: 2000 });
        }
      );
    }
  }

  onEdit(id: number): void {
    const consulta = this.consultas.find(c => c.id === id);
    if (consulta) {
      this.isEditing = true;
      this.consulta = consulta;

      this.consultaForm.patchValue({
        tipoConsulta: this.tipoConsultaOptions.find(option => option.descripcion === consulta.tipo_consulta)?.id || null,
        pacienteInput: `${consulta.paciente.nombre} ${consulta.paciente.apellido_paterno} ${consulta.paciente.apellido_materno}`,
        padecimiento: consulta.padecimiento || '',
        telefono: consulta.telefono,
        edad: consulta.edad,
        modalidad: this.modalidadOptions.find(option => option.descripcion === consulta.modalidad)?.id || null,
        fechaInicio: moment(consulta.fecha_inicio).toDate(),
        paciente_id: consulta.paciente.id // Asegúrate de que el ID del paciente se establece
      });

      this.updatePadecimientoVisibility(this.consultaForm.value.tipoConsulta);

      // Scroll hacia el formulario
      window.scrollTo(0, 0); // Esto llevará al inicio de la página
    }
  }

  onCancel() {
    this.resetForm();
  }
}
