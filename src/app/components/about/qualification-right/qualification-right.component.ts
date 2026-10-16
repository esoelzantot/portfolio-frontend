import { Component, Input, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-qualification-right',
  templateUrl: './qualification-right.component.html',
  styleUrl: './qualification-right.component.css',
})
export class QualificationRightComponent {
  @Input() mainTitle: string = '';
  @Input() subTitle: string = '';
  @Input() calendar: string = '';

  readonly isDarkTheme = inject(ThemeService).isDark;
}
