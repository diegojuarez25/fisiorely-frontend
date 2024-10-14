import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {
  constructor(private router: Router) {}

  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }

  confirmExit() {
    if (confirm("¿Seguro que quieres salir?")) {
      this.navigateTo('login');
    }
  }
}
