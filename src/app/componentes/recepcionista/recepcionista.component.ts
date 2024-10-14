import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recepcionista',
  templateUrl: './recepcionista.component.html',
  styleUrls: ['./recepcionista.component.css']
})
export class RecepcionistaComponent {
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
