import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Ilangu Trust';
  menuOpen = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  toggleSideMenu() {
    this.menuOpen = !this.menuOpen;
    const menu = document.getElementById('sideMenu');
    if (this.menuOpen) {
      menu?.classList.add('showNavMenu');
    } else {
      menu?.classList.remove('showNavMenu');
    }
  }
  closeSideMenu() {
    this.menuOpen = false;
    document.getElementById('sideMenu')?.classList.remove('showNavMenu');
  }

  // Close the menu if clicking outside
  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: Event) {
    const menu = document.getElementById('sideMenu');
    const menuButton = document.querySelector('.showMenu');

    if (
      this.menuOpen &&
      menu &&
      !menu.contains(event.target as Node) &&
      menuButton &&
      !menuButton.contains(event.target as Node)
    ) {
      this.closeSideMenu();
    }
  }
  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
}
