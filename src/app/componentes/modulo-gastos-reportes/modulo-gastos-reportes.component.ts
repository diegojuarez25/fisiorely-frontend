import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormaPagoService } from '../../../services/formaPago.service';
import { GastosService } from '../../../services/gastos.service';

@Component({
  selector: 'app-modulo-gastos-reportes',
  templateUrl: './modulo-gastos-reportes.component.html',
  styleUrls: ['./modulo-gastos-reportes.component.css']
})
export class ModuloGastosReportesComponent implements OnInit {
  gastos: any[] = [];
  formasPago: any[] = [];
  filteredGastos: any[] = [];
  totalGastosHoy: number = 0;
  hasGastosHoy: boolean = false;
  startDate: Date | null = new Date();  // Fecha de inicio por defecto (hoy)
  endDate: Date | null = new Date();    // Fecha de fin por defecto (hoy)
  conceptoFilter: string = '';
  formaPagoFilter: string = '';  // Añadido para el filtro por forma de pago

  displayedColumns: string[] = ['concepto', 'fecha', 'forma_pago', 'monto'];

  constructor(
    private gastosService: GastosService,
    private formaPagoService: FormaPagoService
  ) {}

  ngOnInit(): void {
    this.obtenerGastos();
    this.obtenerFormasPago();
  }

  obtenerGastos(): void {
    this.gastosService.obtenerGastos().subscribe(data => {
      this.gastos = data;
      this.filtrarGastos();  // Filtrar por la fecha actual al inicio
    });
  }

  obtenerFormasPago(): void {
    this.formaPagoService.obtenerFormasPago().subscribe(data => {
      this.formasPago = data;
    });
  }

  filtrarGastos(): void {
    let filtered = this.gastos;
  
    // Filtrar por rango de fechas
    if (this.startDate && this.endDate) {
      const formattedStartDate = formatDate(this.startDate, 'yyyy-MM-dd', 'en-US');
      const formattedEndDate = formatDate(this.endDate, 'yyyy-MM-dd', 'en-US');
      filtered = filtered.filter(gasto => {
        const gastoDate = formatDate(gasto.fecha, 'yyyy-MM-dd', 'en-US');
        return gastoDate >= formattedStartDate && gastoDate <= formattedEndDate;
      });
    }
  
    // Filtrar por concepto
    if (this.conceptoFilter) {
      filtered = filtered.filter(gasto => gasto.concepto.toLowerCase().includes(this.conceptoFilter.toLowerCase()));
    }
  
    // Filtrar por forma de pago
    if (this.formaPagoFilter && this.formaPagoFilter !== 'todas') {
      filtered = filtered.filter(gasto => gasto.forma_pago.descripcion.toLowerCase() === this.formaPagoFilter.toLowerCase());
    }
  
    this.filteredGastos = filtered;
    this.calcularTotalGastos();
  }
  
  calcularTotalGastos(): void {
    this.totalGastosHoy = this.filteredGastos.reduce((total, gasto) => total + gasto.monto, 0);
    this.hasGastosHoy = this.filteredGastos.length > 0;
  }

  exportarGastosHoyExcel(): void {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    const gastosHoy = this.filteredGastos.map(gasto => ({
      Concepto: gasto.concepto,
      Fecha: formatDate(gasto.fecha, 'yyyy-MM-dd', 'en-US'),
      'Forma de Pago': gasto.forma_pago.descripcion,
      Monto: gasto.monto
    }));

    const worksheet = XLSX.utils.json_to_sheet(gastosHoy);
    const workbook = { Sheets: { 'Gastos Hoy': worksheet }, SheetNames: ['Gastos Hoy'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Gastos_Hoy_${today}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  onStartDateChange(event: any): void {
    this.startDate = event.value;
    this.filtrarGastos();
  }

  onEndDateChange(event: any): void {
    this.endDate = event.value;
    this.filtrarGastos();
  }

  onConceptoChange(event: any): void {
    this.conceptoFilter = event.target.value;
    this.filtrarGastos();
  }

  onFormaPagoChange(event: any): void {
    this.formaPagoFilter = event.value;
    this.filtrarGastos();
  }
  
}
