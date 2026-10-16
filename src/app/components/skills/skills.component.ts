import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { ISkill, SkillService } from '../../services/skill.service';

import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit, AfterViewInit {
  readonly isDarkTheme = inject(ThemeService).isDark;
  imageURL = ''; // images are full Cloudinary URLs now

  constructor(
    private skillService: SkillService
  ) {}

  ngOnInit() {
    // Api Call
    this.skillService.getAllSkills().subscribe((skills) => {
      this.skills = skills;
    });
  }

  ngAfterViewInit(): void {
    this.scrollAnimation();
  }

  skills: ISkill[] = [];

  activeIndex: number | null = null;

  toggleSkills(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
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

    sr.reveal('.skills-description', {
      delay: 500,
      origin: 'left',
    });

    sr.reveal('.skills_content', {
      delay: 600,
      origin: 'bottom',
      interval: 100,
    });
  }
}
