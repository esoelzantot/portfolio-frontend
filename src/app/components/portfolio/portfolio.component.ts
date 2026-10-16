import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
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
  imageURL = ''; // images are full Cloudinary URLs now

  constructor(
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    // Api Call
    this.projectService.getAllProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  ngAfterViewInit(): void {
    this.scrollAnimation();
  }

  projects: IProject[] = [];

  itemsPerPage: number = 4; // Number of items to display per page
  currentPage: number = 1; // Current active page
  isModalOpen: boolean[] = Array(this.projects.length).fill(false); // Adjust the size of this array based on the number of portfolio items

  get totalPages(): number {
    return Math.ceil(this.projects.length / this.itemsPerPage);
  }

  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.projects.slice(startIndex, startIndex + this.itemsPerPage);
  }

  openModal(index: number): void {
    console.log('clicked');
    this.isModalOpen[index] = true;
  }

  closeModal(index: number): void {
    this.isModalOpen[index] = false;
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
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
    sr.reveal('.about-info .btn', {
      delay: 400,
      origin: 'right',
    });

    sr.reveal('.portfolio-description', {
      delay: 500,
      origin: 'left',
    });

    sr.reveal('.portfolio-card', {
      delay: 600,
      origin: 'bottom',
      interval: 100,
    });
  }
}
