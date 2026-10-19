import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Full-page loading screen shown while the page's data is on its way.
 * Its look mirrors the static pre-boot loader in index.html, so the hand-off
 * from "Angular is starting" to "data is loading" is seamless.
 */
@Component({
  selector: 'app-page-loader',
  standalone: true,
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.css',
})
export class PageLoaderComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Input() dark = false;

  private readonly document = inject(DOCUMENT);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      // the page underneath shouldn't scroll while it's covered
      this.document.documentElement.style.overflow = this.visible ? 'hidden' : '';
    }
  }

  ngOnDestroy(): void {
    this.document.documentElement.style.overflow = '';
  }
}
