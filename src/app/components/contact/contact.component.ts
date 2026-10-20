import { AfterViewInit, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { ThemeService } from '../../services/theme.service';
import { ContactService, IContact } from '../../services/contact.service';

import ScrollReveal from 'scrollreveal';

const EMAILJS_CONFIG = {
  serviceId: 'service_yw7gthw',
  templateId: 'template_tlmo40n',
  publicKey: 'ZZ7WvkUmZtRzzn2uh',
} as const;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit, AfterViewInit {
  private readonly contactService = inject(ContactService);
  private readonly fb = inject(FormBuilder);

  readonly isDarkTheme = inject(ThemeService).isDark;
  readonly isSending = signal(false);

  readonly contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  contact: IContact = {
    phone: '',
    email: '',
    location: '',
  };

  ngOnInit(): void {
    this.contactService.getContactData().subscribe((contactData) => {
      this.contact = contactData;
    });
  }

  ngAfterViewInit(): void {
    this.scrollAnimation();
  }

  async onSubmit(): Promise<void> {
    if (this.isSending()) return;

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      alert('Please fill in all required fields.');
      return;
    }

    const { name, email, subject, message } = this.contactForm.getRawValue();

    this.isSending.set(true);
    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: name,
          from_email: email,
          subject,
          message,
        },
        { publicKey: EMAILJS_CONFIG.publicKey }
      );

      console.log('SUCCESS!', response.status, response.text);
      alert('Email sent successfully!');
      this.contactForm.reset();
    } catch (error: unknown) {
      const err = error as { status?: number; text?: string };
      console.error('EmailJS failed:', err.status, err.text);

      alert(
        err.status === 412
          ? 'Email service is temporarily unavailable. Please try again later.'
          : 'Failed to send the email. Please try again.'
      );
    } finally {
      this.isSending.set(false);
    }
  }

  private scrollAnimation(): void {
    const sr = ScrollReveal({
      distance: '60px',
      duration: 2000,
      delay: 100,
      reset: true,
    });

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
