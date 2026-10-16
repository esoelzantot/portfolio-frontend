import { Component, Input, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-qualification-left',
  templateUrl: './qualification-left.component.html',
  styleUrl: './qualification-left.component.css',
})
export class QualificationLeftComponent {
  @Input() mainTitle: string = '';
  @Input() subTitle: string = '';
  @Input() calendar: string = '';

  readonly isDarkTheme = inject(ThemeService).isDark;
}
