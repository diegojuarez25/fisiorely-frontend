import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate(2000)
      ])
    ])
  ]
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({});
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe(
        (response: any) => {
          if (response && response.token) {
            this.authService.setToken(response.token);
            this.authService.setRole(response.role_id); // Almacena el rol del usuario
            this.redirectByRole(response.role_id);
          } else {
            this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
          }
        },
        (error: any) => {
          this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
        }
      );
    } else {
      this.errorMessage = 'Por favor, completa todos los campos.';
    }
  }

  redirectByRole(roleId: number): void {
    console.log('RoleId recibido:', roleId);

    switch (roleId) {
      case 1: // Administrador
        this.router.navigate(['/administrador']);
        break;
      case 2: // Recepcionista
        this.router.navigate(['/recepcionista']);
        break;
      default:
        console.error('RoleId no reconocido:', roleId);
        this.router.navigate(['/']); // Redirige a una página por defecto si el rol no está definido correctamente
        break;
    }
  }
}
