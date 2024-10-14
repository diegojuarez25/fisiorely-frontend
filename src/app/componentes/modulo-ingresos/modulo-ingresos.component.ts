import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { IngresosService } from '../../../services/ingresos.service';
import { TipoIngresoService } from '../../../services/tipo-ingreso.service';
import { PacienteService } from '../../../services/pacientes.service';
import { FormaPagoService } from '../../../services/formaPago.service';
import { ModalidadService } from '../../../services/modalidad.service';
import moment from 'moment';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-modulo-ingresos',
  templateUrl: './modulo-ingresos.component.html',
  styleUrls: ['./modulo-ingresos.component.css']
})
export class ModuloIngresosComponent implements OnInit {
  ingresos: any[] = [];
  tiposIngreso: any[] = [];
  pacientes: any[] = [];
  formasPago: any[] = [];
  modalidades: any[] = [];
  filteredPacientesOptions!: Observable<any[]>;
  ingresoForm: FormGroup;
  editMode = false;
  ingresoEdit: any = null;
  filteredIngresos: any[] = [];
  paginatedIngresos: any[] = [];
  pageSize = 6;
  pageIndex = 0;
  pacient = 0;


  constructor(
    private ingresosService: IngresosService,
    private tipoIngresoService: TipoIngresoService,
    private pacienteService: PacienteService,
    private formaPagoService: FormaPagoService,
    private modalidadService: ModalidadService,
    private fb: FormBuilder
  ) {
    this.ingresoForm = this.fb.group({
      tipo_ingreso_id: ['', Validators.required],
      fecha_inicio: [null, Validators.required],
      // fecha_fin: [null, Validators.required],
      paciente_id: ['', Validators.required],
      forma_pago_id: ['', Validators.required],
      monto: ['', Validators.required],
      persona_que_atendio: ['', Validators.required],
      modalidad_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerIngresos();
    this.obtenerTiposIngreso();
    this.obtenerPacientes();
    this.obtenerFormasPago();
    this.obtenerModalidades();
  }

  obtenerIngresos(): void {
    this.ingresosService.obtenerIngresos().subscribe(data => {
      this.ingresos = data;
      this.filteredIngresos = data;
      this.updatePaginatedIngresos();
    });
  }

  obtenerTiposIngreso(): void {
    this.tipoIngresoService.obtenerTiposIngreso().subscribe(data => {
      this.tiposIngreso = data;
    });
  }

  obtenerPacientes(): void {
    this.pacienteService.getPacientes().subscribe(data => {
      this.pacientes = data;
      this.setupPacienteFilter();
    });
  }

  obtenerFormasPago(): void {
    this.formaPagoService.obtenerFormasPago().subscribe(data => {
      this.formasPago = data;
    });
  }

  obtenerModalidades(): void {
    this.modalidadService.obtenerModalidades().subscribe(data => {
      this.modalidades = data;
    });
  }

  agregarOActualizarIngreso(): void {
    if (this.ingresoForm.valid) {
      const ingreso = {
        ...this.ingresoForm.value,
        paciente_id : this.pacient,
        fecha_inicio: moment(this.ingresoForm.value.fecha_inicio).format('YYYY-MM-DD'),
        // fecha_fin: moment(this.ingresoForm.value.fecha_fin).format('YYYY-MM-DD HH:mm:ss')
      };

      if (this.editMode) {
        this.ingresosService.actualizarIngreso(this.ingresoEdit.id, ingreso).subscribe(() => {
          this.resetForm();
          this.obtenerIngresos();
        });
      } else {
        this.ingresosService.agregarIngreso(ingreso).subscribe((res) => {
          if(res.message = 'Ingreso creado exitosamente'){
            alert('ingreso creado correctamente')
          }
          this.resetForm();
          this.obtenerIngresos();
        });
      }
    }
  }

  editarIngreso(ingreso: any): void {
    this.editMode = true;
    this.ingresoEdit = ingreso;
    this.ingresoForm.patchValue({
      tipo_ingreso_id: ingreso.tipo_ingreso_id,
      fecha_inicio: moment(ingreso.fecha_inicio).toDate(),
      // fecha_fin: moment(ingreso.fecha_fin).toDate(),
      paciente_id: this.pacient,
      forma_pago_id: ingreso.forma_pago_id,
      monto: ingreso.monto,
      persona_que_atendio: ingreso.persona_que_atendio,
      modalidad_id: ingreso.modalidad_id
    });
    window.scrollTo(0, 0); // Esto llevará al inicio de la página
  }

  confirmarEliminacion(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este ingreso?')) {
      this.ingresosService.eliminarIngreso(id).subscribe(() => {
        this.obtenerIngresos();
      });
    }
  }

  resetForm(): void {
    this.ingresoForm.reset();
    this.editMode = false;
    this.ingresoEdit = null;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredIngresos = this.ingresos.filter(ingreso =>
      ingreso.paciente.nombre.toLowerCase().includes(filterValue) ||
      ingreso.paciente.apellido_paterno.toLowerCase().includes(filterValue) ||
      ingreso.paciente.apellido_materno.toLowerCase().includes(filterValue)
    );
    this.updatePaginatedIngresos();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedIngresos();
  }

  updatePaginatedIngresos(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedIngresos = this.filteredIngresos.slice(startIndex, endIndex);
  }

  private setupPacienteFilter() {
    this.filteredPacientesOptions = this.ingresoForm.get('paciente_id')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : '')),
      map(value => this.filterPacientes(value))
    );
  }

  private filterPacientes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.pacientes.filter(paciente =>
      `${paciente.nombre} ${paciente.apellido_paterno} ${paciente.apellido_materno}`.toLowerCase().includes(filterValue)
    );
  }

  onPacienteSelected(paciente: any) {
    this.pacient = paciente.id;
    this.ingresoForm.patchValue({
      paciente_id: `${paciente.nombre} ${paciente.apellido_paterno}`, // Mostrar nombre completo
      modalidad_id: paciente.modalidad_id// Guardar el ID del paciente para enviar al backend
    });
  }
}