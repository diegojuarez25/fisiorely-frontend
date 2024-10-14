// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CalendarioConsultasRComponent } from './calendario-consultas-r/calendario-consultas-r.component';
import { CalendarioConsultasComponent } from './calendario-consultas/calendario-consultas.component';
import { AdministradorComponent } from './componentes/administrador/administrador.component';
import { CorteCajaComponent } from './componentes/corte-caja/corte-caja.component';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { ModuloAgendaRComponent } from './componentes/modulo-agenda-r/modulo-agenda-r.component';
import { ModuloAgendaComponent } from './componentes/modulo-agenda/modulo-agenda.component';
import { ModuloGastosRComponent } from './componentes/modulo-gastos-r/modulo-gastos-r.component';
import { ModuloGastosComponent } from './componentes/modulo-gastos/modulo-gastos.component';
import { ModuloIngresosRComponent } from './componentes/modulo-ingresos-r/modulo-ingresos-r.component';
import { ModuloIngresosComponent } from './componentes/modulo-ingresos/modulo-ingresos.component';
import { ModuloPacientesRComponent } from './componentes/modulo-pacientes-r/modulo-pacientes-r.component';
import { ModuloPacientesComponent } from './componentes/modulo-pacientes/modulo-pacientes.component';
import { ModuloReportesComponent } from './componentes/modulo-reportes/modulo-reportes.component';
import { RecepcionistaComponent } from './componentes/recepcionista/recepcionista.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'administrador', component: AdministradorComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1 } },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1 } },
  { path: 'ingresos', component: ModuloIngresosComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1 } },
  { path: 'pacientes', component: ModuloPacientesComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1 } },
  { path: 'recepcionista', component: RecepcionistaComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 2 } },
  { path: 'agenda', component: ModuloAgendaComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1  } },
  { path: 'gastos', component: ModuloGastosComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1 } },
  { path: 'reportes', component: ModuloReportesComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1 } },
  { path: 'corteCaja', component: CorteCajaComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1 } },
  { path: 'calendario', component: CalendarioConsultasComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1 } },
  { path: 'ingresos-r', component: ModuloIngresosRComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 2 }},
  { path: 'pacientes-r',component: ModuloPacientesRComponent, canActivate:[AuthGuard, RoleGuard], data: { expectedRole: 2}},
  { path: 'gastos-r' , component: ModuloGastosRComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 2}},
  { path: 'agenda-r',  component: ModuloAgendaRComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 2}},
  { path: 'calendario-r', component: CalendarioConsultasRComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 2 }},
  { path: 'agenda/editar/:id', component: ModuloAgendaComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1 } }, // Nueva ruta para editar
  { path: 'agenda/nuevo', component: ModuloAgendaComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 1 } }, // Nueva ruta para crear nueva consulta
  { path: 'agenda-r/editar/:id', component: ModuloAgendaRComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 2 } }, // Nueva ruta para editar
  { path: 'agenda-r/nuevo', component: ModuloAgendaRComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 2 } } // Nueva ruta para crear nueva consulta
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
