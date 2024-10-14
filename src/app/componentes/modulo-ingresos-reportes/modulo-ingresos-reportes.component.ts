import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { FormaPagoService } from '../../../services/formaPago.service';
import { IngresosService } from '../../../services/ingresos.service';
import { ModalidadService } from '../../../services/modalidad.service';
import { TipoIngresoService } from '../../../services/tipo-ingreso.service';

@Component({
  selector: 'app-modulo-ingresos-reportes',
  templateUrl: './modulo-ingresos-reportes.component.html',
  styleUrls: ['./modulo-ingresos-reportes.component.css']
})
export class ModuloIngresosReportesComponent implements OnInit {
  ingresos: any[] = [];
  filteredIngresos: any[] = [];
  totalIngresosFiltrados: number = 0;
  hasIngresosFiltrados: boolean = false;
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  selectedModalidad: string = '';
  selectedFormaPago: string = '';
  selectedTipoIngreso: string = '';
  modalidades: any[] = []; // Lista de modalidades
  formasPago: any[] = []; // Lista de formas de pago
  tiposIngreso: any[] = []; // Lista de tipos de ingreso

  displayedColumns: string[] = ['tipo_ingreso', 'fecha', 'modalidad', 'forma_pago', 'monto'];

  constructor(
    private ingresosService: IngresosService,
    private modalidadService: ModalidadService,
    private formaPagoService: FormaPagoService,
    private tipoIngresoService: TipoIngresoService
  ) {}

  ngOnInit(): void {
    this.obtenerModalidades();
    this.obtenerFormasPago();
    this.obtenerTiposIngreso();
    this.obtenerIngresos(); // Cargar ingresos al iniciar
  }

  obtenerModalidades(): void {
    this.modalidadService.obtenerModalidades().subscribe(data => {
      this.modalidades = data;
    });
  }

  obtenerFormasPago(): void {
    this.formaPagoService.obtenerFormasPago().subscribe(data => {
      this.formasPago = data;
    });
  }

  obtenerTiposIngreso(): void {
    this.tipoIngresoService.obtenerTiposIngreso().subscribe(data => {
      this.tiposIngreso = data;
    });
  }

  obtenerIngresos(): void {
    this.ingresosService.obtenerIngresos().subscribe(data => {
      // Mapear ingresos y formatear fechas
      this.ingresos = data.map((ingreso: any) => ({
        ...ingreso,
        fecha: moment(ingreso.fecha_inicio).format('YYYY-MM-DD') // Formatear la fecha
      }));
      // Filtrar por fecha actual al inicializar
      this.fechaInicio = new Date();
      this.fechaFin = new Date();
      this.aplicarFiltros(); // Aplicar filtros después de cargar los datos
    });
  }

  aplicarFiltros(): void {
    // Convertir las fechas de inicio y fin a formato 'YYYY-MM-DD' para la comparación
    const fechaInicioFormatted = this.fechaInicio ? moment(this.fechaInicio).format('YYYY-MM-DD') : null;
    const fechaFinFormatted = this.fechaFin ? moment(this.fechaFin).format('YYYY-MM-DD') : null;

    this.filteredIngresos = this.ingresos.filter(ingreso => {
      const fechaIngreso = moment(ingreso.fecha).format('YYYY-MM-DD');
      const fechaValida = (!fechaInicioFormatted || fechaIngreso >= fechaInicioFormatted) &&
                           (!fechaFinFormatted || fechaIngreso <= fechaFinFormatted);
      const modalidadValida = !this.selectedModalidad || ingreso.modalidad.id === this.selectedModalidad;
      const formaPagoValida = !this.selectedFormaPago || ingreso.forma_pago.id === this.selectedFormaPago;
      const tipoIngresoValido = !this.selectedTipoIngreso || ingreso.tipo_ingreso.id === this.selectedTipoIngreso;
      return fechaValida && modalidadValida && formaPagoValida && tipoIngresoValido;
    });

    this.calcularTotalIngresos();
  }

  onFechaInicioChange(event: any): void {
    this.fechaInicio = event.value;
    this.aplicarFiltros();
  }

  onFechaFinChange(event: any): void {
    this.fechaFin = event.value;
    this.aplicarFiltros();
  }

  onModalidadChange(modalidadId: string): void {
    this.selectedModalidad = modalidadId;
    this.aplicarFiltros();
  }

  onFormaPagoChange(formaPagoId: string): void {
    this.selectedFormaPago = formaPagoId;
    this.aplicarFiltros();
  }

  onTipoIngresoChange(tipoIngresoId: string): void {
    this.selectedTipoIngreso = tipoIngresoId;
    this.aplicarFiltros();
  }

  calcularTotalIngresos(): void {
    this.totalIngresosFiltrados = this.filteredIngresos.reduce((total, ingreso) => total + ingreso.monto, 0);
    this.hasIngresosFiltrados = this.filteredIngresos.length > 0;
  }

  exportarIngresosExcel(): void {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    const ingresosFiltrados = this.filteredIngresos.map(ingreso => ({
      'Tipo de Ingreso': ingreso.tipo_ingreso.descripcion,
      Fecha: formatDate(ingreso.fecha, 'yyyy-MM-dd', 'en-US'),
      Modalidad: ingreso.modalidad.descripcion,
      'Forma de Pago': ingreso.forma_pago.descripcion,
      Monto: ingreso.monto
    }));

    const worksheet = XLSX.utils.json_to_sheet(ingresosFiltrados);
    const workbook = { Sheets: { 'Ingresos Filtrados': worksheet }, SheetNames: ['Ingresos Filtrados'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ingresos_${today}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
