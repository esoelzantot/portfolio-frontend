import { Injectable, signal } from '@angular/core';

/** Requests faster than this never show the loader, so there is no flash. */
const SHOW_DELAY_MS = 150;
/** Once shown, the loader stays at least this long, so it never flickers. */
const MIN_VISIBLE_MS = 500;

/**
 * Tracks in-flight HTTP requests (fed by LoadingInterceptor) and decides
 * when the full-page loader is visible.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  // starts visible: it takes over from the static loader in index.html
  private readonly _visible = signal(true);
  readonly visible = this._visible.asReadonly();

  private pending = 0;
  private shownAt = Date.now();
  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;

  start(): void {
    this.pending++;
    this.clearHideTimer();

    if (this._visible() || this.showTimer) return;
    this.showTimer = setTimeout(() => {
      this.showTimer = undefined;
      this._visible.set(true);
      this.shownAt = Date.now();
    }, SHOW_DELAY_MS);
  }

  stop(): void {
    this.pending = Math.max(0, this.pending - 1);
    if (this.pending === 0) this.scheduleHide();
  }

  /** Called after the first render, in case the first page made no requests. */
  settleInitial(): void {
    if (this.pending === 0) this.scheduleHide();
  }

  private scheduleHide(): void {
    clearTimeout(this.showTimer);
    this.showTimer = undefined;
    if (!this._visible()) return;

    const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - this.shownAt));
    this.clearHideTimer();
    this.hideTimer = setTimeout(() => {
      this.hideTimer = undefined;
      if (this.pending === 0) this._visible.set(false);
    }, remaining);
  }

  private clearHideTimer(): void {
    clearTimeout(this.hideTimer);
    this.hideTimer = undefined;
  }
}
