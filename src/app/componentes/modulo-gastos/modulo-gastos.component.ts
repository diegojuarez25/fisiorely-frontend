import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { FormaPagoService } from '../../../services/formaPago.service';
import { GastosService } from '../../../services/gastos.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-modulo-gastos',
  templateUrl: './modulo-gastos.component.html',
  styleUrls: ['./modulo-gastos.component.css']
})
export class ModuloGastosComponent implements OnInit {
  gastos: any[] = [];
  gastoForm: FormGroup;
  editMode = false;
  gastoEdit: any = null;
  filteredGastos: any[] = [];
  formasPago: any[] = [];
  pageSize = 6;
  pageIndex = 0;


  constructor(
    private gastosService: GastosService,
    private fb: FormBuilder,
    private formaPagoService: FormaPagoService,
    private elementRef: ElementRef
  ) {
    this.gastoForm = this.fb.group({
      concepto: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0.01)]],
      forma_pago_id: ['', Validators.required],
      fecha: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerGastos();
    this.obtenerFormasPago();
    this.configureTimePickerPosition();
    this.updatePaginatedGastos();
  }

  obtenerGastos(): void {
    this.gastosService.obtenerGastos().subscribe(data => {
      this.gastos = data;
      this.filteredGastos = data;
      this.updatePaginatedGastos(); 
    });
  }

  obtenerFormasPago(): void {
    this.formaPagoService.obtenerFormasPago().subscribe(data => {
      this.formasPago = data;
    });
  }

  agregarOActualizarGasto(): void {
    if (this.gastoForm.valid) {
      const { concepto, monto, forma_pago_id, fecha } = this.gastoForm.value;
      const fechaISO = moment(fecha).format();  // Formatea la fecha en formato ISO

      const gastoData = {
        concepto,
        monto,
        forma_pago_id,
        fecha: fechaISO
      };

      if (this.editMode) {
        this.gastosService.actualizarGasto(this.gastoEdit.id, gastoData).subscribe(() => {
          this.obtenerGastos();
          this.resetForm();
        });
      } else {
        this.gastosService.agregarGasto(gastoData).subscribe(() => {
          this.obtenerGastos();
          this.resetForm();
        });
      }
    } else {
      console.log('El formulario no es válido');
    }
  }

  editarGasto(gasto: any): void {
    this.editMode = true;
    this.gastoEdit = gasto;
  
    // Asegúrate de manejar correctamente la fecha y la hora si es un objeto Date
    if (typeof gasto.fecha === 'string') {
      gasto.fecha = new Date(gasto.fecha); // Convierte la fecha a objeto Date si es un string
    }
  
    this.gastoForm.patchValue({
      concepto: gasto.concepto,
      monto: gasto.monto,
      forma_pago_id: gasto.forma_pago_id,
      fecha: gasto.fecha // Asegúrate de que la fecha se establezca correctamente
    });
    window.scrollTo(0, 0); // Esto llevará al inicio de la página

  }
  
  confirmarEliminacion(id: number): void {
    const confirmacion = confirm("¿Seguro que quieres borrar este gasto?");
    if (confirmacion) {
      this.eliminarGasto(id);
    }
  }

  eliminarGasto(id: number): void {
    this.gastosService.eliminarGasto(id).subscribe(() => {
      this.obtenerGastos();
    });
  }

  resetForm(): void {
    this.gastoForm.reset();
    this.editMode = false;
    this.gastoEdit = null;
  }

  applyFilter(event: any): void {
    const filterValue = event.target.value.toLowerCase().trim();
    if (filterValue) {
      this.filteredGastos = this.gastos.filter(gasto =>
        gasto.concepto.toLowerCase().includes(filterValue) ||
        moment(gasto.fecha).format('YYYY-MM-DD HH:mm').toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredGastos = [...this.gastos]; // Clonar el array original
    }
  }

  configureTimePickerPosition(): void {
    const timePicker = this.elementRef.nativeElement.querySelector('.ui-timepicker');

    if (timePicker) {
      const rect = timePicker.getBoundingClientRect();
      const navbarHeight = 100; // Ajusta según la altura de tu barra de navegación
      const screenHeight = window.innerHeight;

      if (rect.bottom > screenHeight - navbarHeight) {
        timePicker.style.top = `calc(100px + 1rem - ${rect.height}px)`; // Ajusta según tu diseño
      }
    }
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedGastos();
  }
  updatePaginatedGastos(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredGastos = this.gastos.slice(startIndex, endIndex);
  }
}