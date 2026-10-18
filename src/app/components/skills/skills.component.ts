import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  afterNextRender,
  inject,
} from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { ISkill, SkillService } from '../../services/skill.service';

import ScrollReveal from 'scrollreveal';

// first keyword found in a category name picks its card icon
const CATEGORY_ICONS: ReadonlyArray<[RegExp, string]> = [
  [/\b(state|redux|bloc|getx|provider)\b/i, 'uil-sitemap'],
  [/\b(mobile|flutter|android|ios|react native)\b/i, 'uil-mobile-android'],
  [/\b(frontend|front-end|web|ui)\b/i, 'uil-desktop'],
  [/\b(backend|back-end|api|server)\b/i, 'uil-server-network'],
  [/\b(database|db|sql|mongo)\w*/i, 'uil-database'],
  [/\b(design|figma|ux)\b/i, 'uil-palette'],
  [/\b(test|testing|qa)\b/i, 'uil-bug'],
  [/\b(tools?|devops|git|cloud|deploy)\b/i, 'uil-wrench'],
  [/\b(languages?|programming)\b/i, 'uil-brackets-curly'],
];

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit, AfterViewInit {
  readonly isDarkTheme = inject(ThemeService).isDark;
  private readonly injector = inject(Injector);
  imageURL = ''; // images are full Cloudinary URLs now

  constructor(
    private skillService: SkillService
  ) {}

  ngOnInit() {
    // Api Call
    this.skillService.getAllSkills().subscribe((skills) => {
      this.skills = skills;
      // the cards only exist once the data has rendered
      afterNextRender(() => this.revealCards(), { injector: this.injector });
    });
  }

  ngAfterViewInit(): void {
    this.scrollAnimation();
  }

  skills: ISkill[] = [];

  /** Images that failed to load; their tiles show initials instead. */
  readonly failedImages = new Set<string>();

  iconFor(skill: ISkill): string {
    return (
      CATEGORY_ICONS.find(([pattern]) => pattern.test(skill.category))?.[1] ??
      'uil-brackets-curly'
    );
  }

  experienceLabel(skill: ISkill): string {
    const years = Number(skill.experience);
    if (!Number.isFinite(years) || years <= 0) return skill.experience;
    return `${years}+ ${years === 1 ? 'year' : 'years'}`;
  }

  /** "Redux Toolkit" -> "RT", "GetX" -> "GE" */
  initials(name: string): string {
    const words = name.split(/[\s/]+/).filter(Boolean);
    const letters =
      words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2);
    return letters.toUpperCase();
  }

  // Revealed on the <li>, not the card: ScrollReveal writes an inline
  // transform that would otherwise override the card's hover lift.
  private revealCards(): void {
    ScrollReveal().reveal('.skill-card-container', {
      distance: '60px',
      duration: 2000,
      delay: 600,
      origin: 'bottom',
      interval: 100,
      reset: true,
    });
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

    sr.reveal('.skills-description', {
      delay: 500,
      origin: 'left',
    });
  }
}
