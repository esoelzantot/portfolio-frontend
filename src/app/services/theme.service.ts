import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'selected-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly darkTheme = signal(this.readStoredTheme());

  /** Read-only signal: components read it in templates, so no subscriptions to clean up. */
  readonly isDark = this.darkTheme.asReadonly();

  constructor() {
    document.body.classList.toggle('dark-theme', this.darkTheme());
  }

  setDarkTheme(isDark: boolean): void {
    this.darkTheme.set(isDark);
    document.body.classList.toggle('dark-theme', isDark);
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // storage can be unavailable (private mode, blocked cookies); the theme still works for this visit
    }
  }

  toggle(): void {
    this.setDarkTheme(!this.darkTheme());
  }

  private readStoredTheme(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  }
}
