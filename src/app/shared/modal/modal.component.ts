import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog shell: overlay above the header, body capped to the
 * viewport with its own scroll, Esc / backdrop to close, focus trap and
 * page scroll lock. The caller projects the content and owns `open`.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input() dark = false;
  /** id of the element that titles the dialog (for screen readers) */
  @Input() labelledBy?: string;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialog') private dialog?: ElementRef<HTMLElement>;
  @ViewChild('closeBtn') private closeBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('content') private content?: ElementRef<HTMLElement>;

  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private lastFocused: HTMLElement | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['open'];
    if (!change || (change.firstChange && !this.open)) return;

    if (this.open) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  ngOnDestroy(): void {
    if (this.open) this.unlockScroll();
  }

  requestClose(): void {
    if (this.open) this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  /** Keeps Tab / Shift+Tab inside the dialog while it is open. */
  trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.dialog) return;

    const focusable = Array.from(
      this.dialog.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE)
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private onOpen(): void {
    this.lastFocused = this.document.activeElement as HTMLElement | null;
    this.lockScroll();

    afterNextRender(
      () => {
        this.content?.nativeElement.scrollTo({ top: 0 });
        this.closeBtn?.nativeElement.focus();
      },
      { injector: this.injector }
    );
  }

  private onClose(): void {
    this.unlockScroll();
    this.lastFocused?.focus();
    this.lastFocused = null;
  }

  private lockScroll(): void {
    const body = this.document.body;
    // reserve the scrollbar's width so the page doesn't jump sideways
    const scrollbarWidth =
      this.document.defaultView!.innerWidth -
      this.document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
  }

  private unlockScroll(): void {
    this.document.body.style.overflow = '';
    this.document.body.style.paddingRight = '';
  }
}
