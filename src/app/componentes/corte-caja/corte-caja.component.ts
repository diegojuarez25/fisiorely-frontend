import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CorteCajaService } from '../../../services/corte-caja.service';
import { UserService } from '../../../services/user.service';
import moment from 'moment';

@Component({
  selector: 'app-corte-caja',
  templateUrl: './corte-caja.component.html',
  styleUrls: ['./corte-caja.component.css']
})
export class CorteCajaComponent implements OnInit {

  formularioCorte: FormGroup;
  cortesCaja: any[] = [];
  usuarios: any[] = [];
  botonAgregarCorteDesactivado = true; // Declaración de la propiedad
  corteMostrado: any = null; // Variable para controlar el corte de caja mostrado
  tipoDetalle: 'ingresos' | 'gastos' = 'ingresos'; // Variable para controlar el tipo de detalle mostrado

  constructor(
    private formBuilder: FormBuilder,
    private corteCajaService: CorteCajaService,
    private userService: UserService
  ) {
    this.formularioCorte = this.formBuilder.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      usuarioId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerCortesCaja();

    // Suscribirse a los cambios en el formulario para actualizar el estado del botón
    this.formularioCorte.valueChanges.subscribe(() => {
      this.actualizarEstadoBoton();
    });
  }

  obtenerUsuarios(): void {
    this.userService.getUsers().subscribe(
      usuarios => {
        this.usuarios = usuarios;
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  obtenerCortesCaja(): void {
    this.corteCajaService.obtenerCortesCaja().subscribe(
      cortes => {
        this.cortesCaja = cortes;
      },
      error => {
        console.error('Error al obtener cortes de caja:', error);
      }
    );
  }

  realizarCorteCaja(): void {
    if (this.formularioCorte.valid) {
      const { fechaInicio, fechaFin, usuarioId } = this.formularioCorte.value;

      const corteCajaData = {
        fecha_inicio: moment(fechaInicio).format(), // Formatea la fecha de inicio
        fecha_fin: moment(fechaFin).format(), // Formatea la fecha de fin
        usuario_id: usuarioId // Asumiendo que usuarioId ya contiene el ID correcto
      };

      this.corteCajaService.realizarCorteCaja(corteCajaData).subscribe(
        nuevoCorte => {
          this.cortesCaja.push(nuevoCorte);
          this.formularioCorte.reset();
          this.actualizarEstadoBoton(); // Actualiza el estado del botón después de agregar el corte
        },
        error => {
          console.error('Error al agregar corte de caja:', error);
        }
      );
    }
  }

  eliminarCorteCaja(id: number): void {
    this.corteCajaService.eliminarCorteCaja(id).subscribe(
      () => {
        this.cortesCaja = this.cortesCaja.filter(corte => corte.id !== id);
        this.actualizarEstadoBoton(); // Actualiza el estado del botón después de eliminar el corte
      },
      error => {
        console.error('Error al eliminar corte de caja:', error);
      }
    );
  }

  actualizarEstadoBoton(): void {
    this.botonAgregarCorteDesactivado = !this.formularioCorte.valid;
  }

  mostrarDetalles(corte: any): void {
    this.corteMostrado = corte;
    this.tipoDetalle = 'ingresos'; // Mostrar detalles de ingresos por defecto
  }

  mostrarDetallesGastos(corte: any): void {
    this.corteMostrado = corte;
    this.tipoDetalle = 'gastos'; // Mostrar detalles de gastos
  }

  cerrarDetalles(): void {
    this.corteMostrado = null;
    this.tipoDetalle = 'ingresos'; // Restaurar tipo de detalle a ingresos al cerrar
  }
}
