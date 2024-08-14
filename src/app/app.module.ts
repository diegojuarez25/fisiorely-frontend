import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AppRoutingModule } from './app-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { CalendarModule } from 'primeng/calendar';
import { ActionMenuComponent } from './actionmenu/action-menu.component';
import { AppComponent } from './app.component';
import { CalendarioConsultasRComponent } from './calendario-consultas-r/calendario-consultas-r.component';
import { CalendarioConsultasComponent } from './calendario-consultas/calendario-consultas.component';
import { AdministradorComponent } from './componentes/administrador/administrador.component';
import { CorteCajaComponent } from './componentes/corte-caja/corte-caja.component';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { ModuloAgendaRComponent } from './componentes/modulo-agenda-r/modulo-agenda-r.component';
import { ModuloAgendaComponent } from './componentes/modulo-agenda/modulo-agenda.component';
import { ModuloGastosRComponent } from './componentes/modulo-gastos-r/modulo-gastos-r.component';
import { ModuloGastosReportesComponent } from './componentes/modulo-gastos-reportes/modulo-gastos-reportes.component';
import { ModuloGastosComponent } from './componentes/modulo-gastos/modulo-gastos.component';
import { ModuloIngresosRComponent } from './componentes/modulo-ingresos-r/modulo-ingresos-r.component';
import { ModuloIngresosReportesComponent } from './componentes/modulo-ingresos-reportes/modulo-ingresos-reportes.component';
import { ModuloIngresosComponent } from './componentes/modulo-ingresos/modulo-ingresos.component';
import { ModuloPacientesRComponent } from './componentes/modulo-pacientes-r/modulo-pacientes-r.component';
import { ModuloPacientesComponent } from './componentes/modulo-pacientes/modulo-pacientes.component';
import { ModuloReportesComponent } from './componentes/modulo-reportes/modulo-reportes.component';
import { NavigationBarAdministradorComponent } from './componentes/nabvars/navigation-bar-administrador/navigation-bar-administrador.component';
import { NavigationBarAgendaRComponent } from './componentes/nabvars/navigation-bar-agenda-r/navigation-bar-agenda-r.component';
import { NavigationBarAgendaComponent } from './componentes/nabvars/navigation-bar-agenda/navigation-bar-agenda.component';
import { NavigationBarRecepsionistaComponent } from './componentes/nabvars/navigation-bar-recepsionista/navigation-bar-recepsionista.component';
import { PasswordUpdateComponent } from './componentes/password-update/password-update.component';
import { RecepcionistaComponent } from './componentes/recepcionista/recepcionista.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { NuevoPacienteDialogComponent } from './dialogs/nuevo-paciente-dialog/nuevo-paciente-dialog.component';
import { UpdatePasswordDialogComponent } from './update-password-dialog/update-password-dialog.component';
import { OpenAgendaComponent } from './dialogs/open-agenda/open-agenda.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavigationBarRecepsionistaComponent,
    NavigationBarAdministradorComponent,
    ModuloIngresosComponent,
    ModuloGastosComponent,
    ModuloAgendaComponent,
    ModuloPacientesComponent,
    CorteCajaComponent,
    ModuloReportesComponent,
    UsuariosComponent,
    PasswordUpdateComponent,
    UpdatePasswordDialogComponent,
    RecepcionistaComponent,
    AdministradorComponent,
    NuevoPacienteDialogComponent,
    CalendarioConsultasComponent,
    NavigationBarAgendaComponent,
    ModuloIngresosReportesComponent,
    ModuloGastosReportesComponent,
    ModuloIngresosRComponent,
    ModuloPacientesRComponent,
    ModuloGastosRComponent,
    ModuloAgendaRComponent,
    NavigationBarAgendaRComponent,
    CalendarioConsultasRComponent,
    ActionMenuComponent,
    OpenAgendaComponent,
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatIconModule,
    CommonModule,
    TimepickerModule.forRoot(),
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    BsDatepickerModule.forRoot(),
    CalendarModule,
    FullCalendarModule,
    MatTabsModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDialogModule,

    // Asegúrate de importar FullCalendarModule aquí
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }