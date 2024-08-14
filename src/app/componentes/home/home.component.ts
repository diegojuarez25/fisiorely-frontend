import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {} // Inyecta el servicio Router

  // Método para redirigir a la página de inicio de sesión
  redirectToLogin() {
    // Redirige a la ruta '/login'
    this.router.navigate(['/login']);
  }

}
