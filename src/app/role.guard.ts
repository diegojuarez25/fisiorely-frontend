// role.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const userRole = this.authService.getUserRole();

    // Verificar si expectedRole es un array
    if (Array.isArray(expectedRole)) {
      if (expectedRole.includes(userRole)) {
        return true;
      } else {
        this.router.navigate(['/']); // Redirigir si el rol del usuario no está en expectedRole
        return false;
      }
    } else {
      // Si expectedRole no es un array, verificar directamente la igualdad
      if (userRole === expectedRole) {
        return true;
      } else {
        this.router.navigate(['/']); // Redirigir si el rol del usuario no coincide con expectedRole
        return false;
      }
    }
  }
}
