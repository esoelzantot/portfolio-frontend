import { Component, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private readonly themeService = inject(ThemeService);

  isMenuVisible = false;
  readonly isDarkTheme = this.themeService.isDark;

  readonly navItems = [
    { path: '/home', label: 'Home', icon: 'uil uil-estate' },
    { path: '/about', label: 'About', icon: 'uil uil-user' },
    { path: '/skills', label: 'Skills', icon: 'uil uil-file-alt' },
    { path: '/services', label: 'Services', icon: 'uil uil-briefcase-alt' },
    { path: '/portfolio', label: 'Portfolio', icon: 'uil uil-scenery' },
    { path: '/contact', label: 'Contact', icon: 'uil uil-message' },
  ];

  constructor() {
    // also covers the browser's back/forward buttons, not just link taps
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.toggleMenu(false));
  }

  toggleMenu(show: boolean) {
    this.isMenuVisible = show;
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.toggleMenu(false);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.getElementById('header');
    if (window.scrollY >= 80) {
      header?.classList.add('scroll-header');
    } else {
      header?.classList.remove('scroll-header');
    }
  }
}
