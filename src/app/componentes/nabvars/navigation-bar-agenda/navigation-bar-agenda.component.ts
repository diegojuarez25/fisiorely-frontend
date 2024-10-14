import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar-agenda',
  templateUrl: './navigation-bar-agenda.component.html',
  styleUrls: ['./navigation-bar-agenda.component.css']
})
export class NavigationBarAgendaComponent {

  constructor(private router: Router) {}

  isAgendaActive(): boolean {
    return this.router.url === '/agenda';
  }

  navigateToCalendar(): void {
    if (!this.isAgendaActive()) {
      this.router.navigateByUrl('/calendario');
    }
  }
}
