import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { AboutService, IAbout } from '../../services/about.service';
import { EducationService, IEducation } from '../../services/education.service';
import { IWork, WorkService } from '../../services/work.service';

import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit, AfterViewInit {
  readonly isDarkTheme = inject(ThemeService).isDark;
  activeTab: string = 'education';
  imageURL = ''; // images are full Cloudinary URLs now

  about: IAbout = {
    name: '',
    title: '',
    imageSrc: '',
    description: '',
    experienceYears: 0,
    successProjects: 0,
    cvURL: '',
  };

  educations: IEducation[] = [];

  works: IWork[] = [];

  constructor(
    private aboutService: AboutService,
    private educationService: EducationService,
    private workService: WorkService
  ) {}

  ngOnInit() {
    // API Call
    this.aboutService.getAboutData().subscribe((aboutData) => {
      this.about = aboutData;
    });

    this.educationService.getAllEducations().subscribe((educations) => {
      this.educations = educations;
    });

    this.workService.getAllWorks().subscribe((works) => {
      this.works = works;
    });
  }

  ngAfterViewInit(): void {
    this.scrollAnimation();
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
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
    sr.reveal('.about-info .btn', {
      delay: 400,
      origin: 'right',
    });

    sr.reveal('.about-img', {
      delay: 300,
      origin: 'bottom',
    });
    sr.reveal('.about .description', {
      delay: 400,
      origin: 'right',
    });

    sr.reveal('.qualification-description', {
      delay: 500,
      origin: 'left',
    });

    sr.reveal('.about .professional-list li', {
      delay: 300,
      origin: 'right',
      interval: 100,
    });
  }
}
