import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  afterNextRender,
  inject,
} from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { IService, ServiceService } from '../../services/service.service';

import ScrollReveal from 'scrollreveal';

// first keyword found in a service's title picks its card icon
const SERVICE_ICONS: ReadonlyArray<[RegExp, string]> = [
  [/\b(mobile|flutter|android|ios|react native)\b/i, 'uil-mobile-android'],
  [/\b(ui\/ux|ux|design|figma)\b/i, 'uil-palette'],
  [/\b(backend|back-end|api|server|node|database)\b/i, 'uil-server-network'],
  [/\b(frontend|front-end|web)\b/i, 'uil-desktop'],
  [/\b(seo|performance|optimi[sz]ation)\b/i, 'uil-tachometer-fast'],
  [/\b(devops|deploy|cloud|ci\/cd)\b/i, 'uil-cloud-upload'],
];

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit, AfterViewInit {
  readonly isDarkTheme = inject(ThemeService).isDark;
  private readonly injector = inject(Injector);

  constructor(
    private servicesService: ServiceService
  ) {}

  ngOnInit() {
    // Api Call
    this.servicesService.getAllServices().subscribe((services) => {
      this.services = services;
      // the cards only exist once the data has rendered
      afterNextRender(() => this.revealCards(), { injector: this.injector });
    });
  }

  ngAfterViewInit(): void {
    this.scrollAnimation();
  }

  services: IService[] = [];

  isModalOpen = false;
  // kept after closing so the content stays visible during the fade-out
  selectedService: IService | null = null;

  openModal(service: IService): void {
    this.selectedService = service;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  iconFor(service: IService): string {
    const text = `${service.title} ${service.modalTitle}`;
    return SERVICE_ICONS.find(([pattern]) => pattern.test(text))?.[1] ?? 'uil-brackets-curly';
  }

  // Revealed on the <li>, not the card: ScrollReveal writes an inline
  // transform that would otherwise override the card's hover lift.
  private revealCards(): void {
    ScrollReveal().reveal('.service-container', {
      distance: '60px',
      duration: 2000,
      delay: 600,
      origin: 'bottom',
      interval: 100,
      reset: true,
    });
  }

  private scrollAnimation(): void {
    // Initialize ScrollReveal with default settings
    const sr = ScrollReveal({
      distance: '60px',
      duration: 2000,
      delay: 100,
      reset: true,
    });

    // Apply ScrollReveal to specific elements with customized settings
    sr.reveal('.section-title-01, .section-title-02', {
      delay: 300,
      origin: 'left',
    });

    sr.reveal('.services-description', {
      delay: 500,
      origin: 'left',
    });
  }
}
