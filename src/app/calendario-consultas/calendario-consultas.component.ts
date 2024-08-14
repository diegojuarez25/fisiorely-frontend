import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // Para mostrar mensajes
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ModuloAgendaService } from '../../services/modulo-angeda.service';
import { ActionMenuComponent } from '../actionmenu/action-menu.component';
import { OpenAgendaComponent } from '../dialogs/open-agenda/open-agenda.component'; // Importa tu nuevo componente

@Component({
  selector: 'app-calendario-consultas',
  templateUrl: './calendario-consultas.component.html',
  styleUrls: ['./calendario-consultas.component.css']
})
export class CalendarioConsultasComponent implements OnInit {
  calendarOptions: any = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridDay', // Cambiado a vista diaria
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: esLocale,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    dateClick: this.handleDateClick.bind(this)
  };

  constructor(
    private agendaService: ModuloAgendaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar // Para mostrar mensajes de notificación
  ) {}

  ngOnInit(): void {
    this.loadConsultas();
  }

  loadConsultas() {
    this.agendaService.getConsultas().subscribe(
      consultas => {
        this.calendarOptions.events = consultas.map(consulta => ({
          id: consulta.id,
          title: `${consulta.paciente.nombre} ${consulta.paciente.apellido_paterno} ${consulta.paciente.apellido_materno} - ${consulta.tipo_consulta} (${consulta.modalidad})`,
          start: consulta.fecha_inicio,
          extendedProps: {
            paciente: consulta.paciente,
            tipoConsulta: consulta.tipo_consulta,
            modalidad: consulta.modalidad,
            fecha: consulta.fecha_inicio,
            consultaId: consulta.id // Añadido para facilitar la edición
          }
        }));
      },
      error => {
        console.error('Error al obtener consultas:', error);
      }
    );
  }

  handleEventClick(clickInfo: any) {
    const event = clickInfo.event;
    this.openActionMenu(event);
  }

  handleEventMouseEnter(mouseEnterInfo: any) {
    const paciente = mouseEnterInfo.event.extendedProps.paciente;
    const tipoConsulta = mouseEnterInfo.event.extendedProps.tipoConsulta;
    const modalidad = mouseEnterInfo.event.extendedProps.modalidad;
    const fecha = new Date(mouseEnterInfo.event.extendedProps.fecha);

    const opcionesFecha: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      hour: 'numeric', 
      minute: 'numeric' 
    };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);

    const description = `Nombre del paciente: ${paciente.nombre} ${paciente.apellido_paterno} ${paciente.apellido_materno}\nTipo de consulta: ${tipoConsulta}\nModalidad: ${modalidad}\nDía y Hora: ${fechaFormateada}`;

    mouseEnterInfo.el.setAttribute('title', description);
  }

  handleDateClick(dateClickInfo: any) {
    this.openAgendaComponent(null, dateClickInfo.dateStr);
  }

  openAgendaComponent(event?: any, date?: string) {
    const data = event ? {
      id: event.id,
      paciente: event.extendedProps.paciente,
      tipoConsulta: event.extendedProps.tipoConsulta,
      modalidad: event.extendedProps.modalidad,
      fecha: event.start,
      consultaId: event.extendedProps.consultaId,
      isEditing: true // Añadido para indicar el estado de edición
    } : { date, isEditing: false };
  
    const dialogRef = this.dialog.open(OpenAgendaComponent, {
      width: '700px',
      height: '600px', // Agregado para aumentar la altura del diálogo
      data
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadConsultas(); // Recarga las consultas después de editar o crear
      }
    });
  }
  
  openActionMenu(event: any) {
    const actionMenu = this.dialog.open(ActionMenuComponent, {
      width: '350px',
      data: { event }
    });

    actionMenu.afterClosed().subscribe(result => {
      if (result === 'edit') {
        this.openAgendaComponent(event, event.extendedProps.consultaId); // Pasar consultaId
      } else if (result === 'delete') {
        this.handleDelete(event);
      }
    });
  }

  handleDelete(event: any) {
    if (confirm(`¿Estás seguro de que quieres eliminar la consulta de ${event.title}?`)) {
      this.agendaService.deleteConsulta(event.id).subscribe(
        response => {
          this.snackBar.open('Consulta eliminada correctamente.', '', { duration: 3000 });
          event.remove();
        },
        error => {
          console.error('Error al eliminar la consulta:', error);
          this.snackBar.open('Error al eliminar la consulta.', '', { duration: 3000 });
        }
      );
    }
  }
}
