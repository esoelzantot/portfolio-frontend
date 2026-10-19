import { Component, afterNextRender, inject } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'portfolio';
  readonly isDarkTheme = inject(ThemeService).isDark;
  private readonly loading = inject(LoadingService);
  readonly isLoading = this.loading.visible;

  constructor() {
    // by now the first page has started its requests; if it made none,
    // this hides the loader instead of leaving it up forever
    afterNextRender(() => this.loading.settleInitial());
  }
}
