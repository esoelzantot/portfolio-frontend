import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  afterNextRender,
  inject,
} from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { IProject, ProjectService } from '../../services/project.service';

import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit, AfterViewInit {
  readonly isDarkTheme = inject(ThemeService).isDark;
  private readonly injector = inject(Injector);
  imageURL = ''; // images are full Cloudinary URLs now

  constructor(
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    // Api Call
    this.projectService.getAllProjects().subscribe((projects) => {
      this.projects = projects;
      this.revealCardsAfterRender();
    });
  }

  ngAfterViewInit(): void {
    this.scrollAnimation();
  }

  projects: IProject[] = [];

  itemsPerPage: number = 4; // Number of items to display per page
  currentPage: number = 1; // Current active page

  isModalOpen = false;
  // kept after closing so the content stays visible during the fade-out
  selectedProject: IProject | null = null;

  get totalPages(): number {
    return Math.ceil(this.projects.length / this.itemsPerPage);
  }

  get paginatedItems(): IProject[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.projects.slice(startIndex, startIndex + this.itemsPerPage);
  }

  /** "01", "02", ... numbered across pages, not per page. */
  indexLabel(indexOnPage: number): string {
    const position = (this.currentPage - 1) * this.itemsPerPage + indexOnPage + 1;
    return position.toString().padStart(2, '0');
  }

  openModal(project: IProject): void {
    this.selectedProject = project;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.revealCardsAfterRender();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // The cards only exist once data (or a new page) has rendered. Revealed on
  // the <li>, not the card: ScrollReveal writes an inline transform that would
  // otherwise override the card's hover lift.
  private revealCardsAfterRender(): void {
    afterNextRender(
      () =>
        ScrollReveal().reveal('.portfolio-container', {
          distance: '60px',
          duration: 2000,
          delay: 600,
          origin: 'bottom',
          interval: 100,
          reset: true,
        }),
      { injector: this.injector }
    );
  }

  // Scroll Animation
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

    sr.reveal('.portfolio-description', {
      delay: 500,
      origin: 'left',
    });
  }
}
