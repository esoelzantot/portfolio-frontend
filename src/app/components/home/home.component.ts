import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { HomeService, IHome } from '../../services/home.service';

import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  home: IHome | null = {
    name: '',
    title: '',
    imageSrc: '',
    description: '',
    facebook: '',
    linkedin: '',
    github: '',
  };

  readonly isDarkTheme = inject(ThemeService).isDark;

  imageURL = ''; // images are full Cloudinary URLs now

  constructor(
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    // API Call
    this.homeService.getHomeData().subscribe((homeData) => {
      this.home = homeData;
    });
  }

  ngAfterViewInit(): void {
    this.scrollAnimation();
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
    sr.reveal('.home .home-info h1', {
      delay: 300,
      origin: 'left',
    });

    sr.reveal('.home .home-info h3, .home .home-info p', {
      delay: 400,
      origin: 'right',
    });

    sr.reveal('.home .home-info .btn', {
      delay: 500,
      origin: 'bottom',
    });

    sr.reveal('.media-icons i', {
      delay: 300,
      origin: 'left',
      interval: 100,
    });

    sr.reveal('.home-img', {
      delay: 300,
      origin: 'bottom',
    });
  }
}
