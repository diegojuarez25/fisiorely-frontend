import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar-agenda-r',
  templateUrl: './navigation-bar-agenda-r.component.html',
  styleUrls: ['./navigation-bar-agenda-r.component.css']
})
export class NavigationBarAgendaRComponent {

  constructor(private router: Router) {}

  isAgendaActive(): boolean {
    return this.router.url === '/agenda-r';
  }

  navigateToCalendar(): void {
    if (!this.isAgendaActive()) {
      this.router.navigateByUrl('/calendario-r');
    }
  }
}
