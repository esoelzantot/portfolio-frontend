import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from 'emailjs-com';
import { ThemeService } from '../../services/theme.service';
import { ContactService, IContact } from '../../services/contact.service';

import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;
  readonly isDarkTheme = inject(ThemeService).isDark;

  contact: IContact = {
    phone: '',
    email: '',
    location: '',
  };

  constructor(
    private contactService: ContactService,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Api Call
    this.contactService.getContactData().subscribe((contactData) => {
      this.contact = contactData;
    });
  }

  ngAfterViewInit(): void {
    this.scrollAnimation();
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const templateParams = {
        from_name: this.contactForm.get('name')?.value,
        from_email: this.contactForm.get('email')?.value,
        subject: this.contactForm.get('subject')?.value,
        message: this.contactForm.get('message')?.value,
      };

      emailjs
        .send(
          'service_yw7gthw',
          'template_9mu5wfk',
          templateParams,
          '0c37HU3NHostoYCdX'
        )
        .then(
          (response) => {
            console.log('SUCCESS!', response.status, response.text);
            alert('Email sent successfully!');
            this.contactForm.reset();
          },
          (error) => {
            console.log('FAILED...', error);
            alert('Failed to send the email. Please try again.');
          }
        );
    } else {
      console.log('Form is not valid');
      alert('Please fill in all required fields.');
    }
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

    sr.reveal('.contact-left li', {
      delay: 300,
      origin: 'left',
      interval: 100,
    });
    sr.reveal('.contact-right', {
      delay: 400,
      origin: 'right',
    });

    sr.reveal('.contact-left h2', {
      delay: 500,
      origin: 'left',
    });
  }
}
