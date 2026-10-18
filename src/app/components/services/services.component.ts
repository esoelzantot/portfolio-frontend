import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { IService, ServiceService } from '../../services/service.service';

import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit, AfterViewInit {
  readonly isDarkTheme = inject(ThemeService).isDark;

  constructor(
    private servicesService: ServiceService
  ) {}

  ngOnInit() {
    // Api Call
    this.servicesService.getAllServices().subscribe((services) => {
      this.services = services;
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

    sr.reveal('.service-card', {
      delay: 600,
      origin: 'bottom',
      interval: 100,
    });
  }
}
