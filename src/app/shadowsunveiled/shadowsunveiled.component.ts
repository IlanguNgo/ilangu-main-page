// shadowsunveiled.component.ts
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { ShadowsUnveiledService } from '../services/shadows-unveiled.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { PLATFORM_ID, inject } from '@angular/core';
@Component({
  selector: 'app-shadowsunveiled',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shadowsunveiled.component.html',
  styleUrl: './shadowsunveiled.component.scss',
})
export class ShadowsunveiledComponent implements OnInit {
  shadowFormGroup!: FormGroup;
  submitted = false;
  MAX_FILE_SIZE = 125 * 1024 * 1024; // 125MB in bytes

  academicYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  soloEvents = [
    { id: 'drawing', label: 'Drawing' },
    { id: 'essayWriting', label: 'Essay Writing' },
    { id: 'poetry', label: 'Poetry' },
    { id: 'digital_art_meme_or_poster', label: 'Digital Art/Meme/Poster' },
    { id: 'monoAct', label: 'Mono Act' },
    { id: 'face_painting', label: 'Face Painting' },
  ];

  teamEvents = [
    { id: 'mime', label: 'Mime' },
    { id: 'shortFilm', label: 'Short Film' },
    { id: 'dance', label: 'Dance' },
    { id: 'reels', label: 'Reels' },
    { id: 'music_band', label: 'Music Band' },
    { id: 'animatedVideo', label: 'Animated Video' },
  ];
  private platformID = inject(PLATFORM_ID);
  constructor(
    private fb: FormBuilder,
    private shadowsUnveiledService: ShadowsUnveiledService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.shadowFormGroup = this.fb.group({
      organizationName: ['', Validators.required],
      academicYear: ['', Validators.required],
      course: ['', Validators.required],
      isTeamEvent: [false],
      teamSize: [1],
      teamName: [''],
      queries: [''],
      paymentSlip: [null, Validators.required],
      participants: this.fb.array([]),
      selectedEvents: this.fb.array([]),
    });

    // Initialize with one participant for solo event
    this.addParticipant();

    this.shadowFormGroup
      .get('isTeamEvent')
      ?.valueChanges.subscribe((isTeam) => {
        this.onTeamEventChange(isTeam);
      });

    this.shadowFormGroup.get('teamSize')?.valueChanges.subscribe((size) => {
      this.updateParticipants(size);
    });

    this.router.params.subscribe((param) => {
      if (
        param['action'] == 'downloadBrochure' &&
        isPlatformBrowser(this.platformID)
      ) {
        this.downloadBroucher();
      }
    });
  }

  get participants(): FormArray {
    return this.shadowFormGroup.get('participants') as FormArray;
  }

  get selectedEvents(): FormArray {
    return this.shadowFormGroup.get('selectedEvents') as FormArray;
  }

  addParticipant(): void {
    this.participants.push(
      this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        instagramId: [''], // Add this - no validators (optional)
        followedPage: [false], // Add this - boolean for checkbox
      })
    );
  }

  onTeamEventChange(isTeam: boolean): void {
    const teamNameControl = this.shadowFormGroup.get('teamName');
    const teamSizeControl = this.shadowFormGroup.get('teamSize');

    if (isTeam) {
      teamNameControl?.setValidators([Validators.required]);
      teamSizeControl?.setValidators([Validators.required, Validators.min(2)]);
      teamSizeControl?.setValue(2);
      this.updateParticipants(2);
    } else {
      teamNameControl?.clearValidators();
      teamSizeControl?.clearValidators();
      teamSizeControl?.setValue(1);
      // Keep only one participant for solo
      while (this.participants.length > 1) {
        this.participants.removeAt(this.participants.length - 1);
      }
    }

    teamNameControl?.updateValueAndValidity();
    teamSizeControl?.updateValueAndValidity();

    // Clear selected events when switching
    this.selectedEvents.clear();
  }

  updateParticipants(size: number): void {
    const currentSize = this.participants.length;

    if (size > currentSize) {
      for (let i = currentSize; i < size; i++) {
        this.addParticipant();
      }
    } else if (size < currentSize) {
      for (let i = currentSize - 1; i >= size; i--) {
        this.participants.removeAt(i);
      }
    }
  }

  onEventSelect(event: any, eventType: 'solo' | 'team'): void {
    const eventList = eventType === 'solo' ? this.soloEvents : this.teamEvents;
    const eventItem = eventList.find((e) => e.id === event.target.value);

    if (event.target.checked && eventItem) {
      this.selectedEvents.push(
        this.fb.group({
          eventId: [event.target.value],
          eventName: [eventItem.label],
          eventType: [eventType],
          file: [null],
          driveLink: [''],
        })
      );
    } else {
      const index = this.selectedEvents.controls.findIndex(
        (control) => control.get('eventId')?.value === event.target.value
      );
      if (index > -1) {
        this.selectedEvents.removeAt(index);
      }
    }
  }

  async onEventFileChange(event: any, eventId: string): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      if (file.size > this.MAX_FILE_SIZE) {
        await Swal.fire({
          icon: 'warning',
          title: 'File Size Too Large',
          html: `
            <p>The file size exceeds 125MB limit.</p>
            <p><strong>Please upload your file to Google Drive or YouTube and paste the shareable link below.</strong></p>
          `,
          confirmButtonText: 'OK',
          confirmButtonColor: '#667eea',
        });

        // Clear the file input
        event.target.value = '';

        // Focus on the drive link input after closing the alert
        setTimeout(() => {
          const driveLinkInput = document.getElementById(
            `driveLink-${eventId}`
          );
          if (driveLinkInput) {
            driveLinkInput.focus();
          }
        }, 100);

        return;
      }

      const eventControl = this.selectedEvents.controls.find(
        (control) => control.get('eventId')?.value === eventId
      );
      if (eventControl) {
        eventControl.patchValue({ file: file, driveLink: '' });
        // Clear the drive link input visually
        const driveLinkInput = document.getElementById(
          `driveLink-${eventId}`
        ) as HTMLInputElement;
        if (driveLinkInput) {
          driveLinkInput.value = '';
        }
      }
    }
  }

  async onPaymentSlipChange(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      if (file.size > this.MAX_FILE_SIZE) {
        await Swal.fire({
          icon: 'warning',
          title: 'File Size Too Large',
          html: `
            <p>The payment screenshot exceeds 125MB limit.</p>
            <p><strong>Please reduce the file size and try again.</strong></p>
          `,
          confirmButtonText: 'OK',
          confirmButtonColor: '#667eea',
        });

        // Clear the file input
        event.target.value = '';
        this.shadowFormGroup.patchValue({ paymentSlip: null });

        return;
      }

      this.shadowFormGroup.patchValue({ paymentSlip: file });
    }
  }

  isEventSelected(eventId: string): boolean {
    return this.selectedEvents.controls.some(
      (control) => control.get('eventId')?.value === eventId
    );
  }

  getEventControl(eventId: string): FormGroup | undefined {
    return this.selectedEvents.controls.find(
      (control) => control.get('eventId')?.value === eventId
    ) as FormGroup | undefined;
  }

  async submit(): Promise<void> {
    this.submitted = true;

    // Mark all fields as touched to show validation errors
    this.shadowFormGroup.markAllAsTouched();
    this.participants.controls.forEach((control) => control.markAllAsTouched());

    // Validate basic form fields
    if (this.shadowFormGroup.invalid) {
      await Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly',
        confirmButtonColor: '#667eea',
      });
      return;
    }

    // Validate at least one event is selected
    if (this.selectedEvents.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'No Events Selected',
        text: 'Please select at least one event',
        confirmButtonColor: '#667eea',
      });
      return;
    }

    // Validate that each selected event has either a file or drive link
    const missingEvents: string[] = [];
    this.selectedEvents.controls.forEach((eventControl) => {
      const file = eventControl.get('file')?.value;
      const driveLink = eventControl.get('driveLink')?.value;
      const eventName = eventControl.get('eventName')?.value;

      if (!file && !driveLink) {
        missingEvents.push(eventName);
      }
    });

    if (missingEvents.length > 0) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Event Submissions',
        html: `
          <p>Please upload files or provide drive links for the following events:</p>
          <ul style="text-align: left; padding-left: 20px;">
            ${missingEvents
              .map((name) => `<li><strong>${name}</strong></li>`)
              .join('')}
          </ul>
        `,
        confirmButtonColor: '#667eea',
      });
      return;
    }

    // Validate payment
    const paymentSlip = this.shadowFormGroup.get('paymentSlip')?.value;
    if (!paymentSlip) {
      await Swal.fire({
        icon: 'error',
        title: 'Payment Required',
        text: 'Please upload payment screenshot',
        confirmButtonColor: '#667eea',
      });
      return;
    }

    // Prepare form data
    const formData = new FormData();

    // Add basic fields
    formData.append(
      'organizationName',
      this.shadowFormGroup.get('organizationName')?.value
    );
    formData.append(
      'academicYear',
      this.shadowFormGroup.get('academicYear')?.value
    );
    formData.append('course', this.shadowFormGroup.get('course')?.value);
    formData.append(
      'isTeamEvent',
      this.shadowFormGroup.get('isTeamEvent')?.value
    );
    formData.append(
      'queries',
      this.shadowFormGroup.get('queries')?.value || ''
    );

    // Add team info if team event
    if (this.shadowFormGroup.get('isTeamEvent')?.value) {
      formData.append('teamName', this.shadowFormGroup.get('teamName')?.value);
      formData.append('teamSize', this.shadowFormGroup.get('teamSize')?.value);
    }

    // Add participants
    formData.append('participants', JSON.stringify(this.participants.value));

    // Add payment
    formData.append('paymentSlip', paymentSlip);

    // Add event files and links
    this.selectedEvents.controls.forEach((eventControl, index) => {
      const eventFile = eventControl.get('file')?.value;
      const driveLink = eventControl.get('driveLink')?.value;

      formData.append(`event_${index}_id`, eventControl.get('eventId')?.value);
      formData.append(
        `event_${index}_name`,
        eventControl.get('eventName')?.value
      );
      formData.append(
        `event_${index}_type`,
        eventControl.get('eventType')?.value
      );

      if (eventFile) {
        formData.append(`event_${index}_file`, eventFile);
      } else if (driveLink) {
        formData.append(`event_${index}_driveLink`, driveLink);
      }
    });

    formData.append('eventsCount', this.selectedEvents.length.toString());

    // Show loading
    Swal.fire({
      title: 'Submitting...',
      text: 'Please wait while we process your registration',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    console.log({ formData });
    // Submit to service
    this.shadowsUnveiledService.save(formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Your event registration has been submitted successfully.',
          confirmButtonColor: '#667eea',
        });

        // Reset form
        this.shadowFormGroup.reset();
        this.shadowFormGroup.patchValue({
          isTeamEvent: false,
          teamSize: 1,
        });
        this.selectedEvents.clear();
        this.participants.clear();
        this.addParticipant();
        this.submitted = false;
        //clear all the payment values
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input: any) => {
          input.value = '';
        });
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text:
            error?.error?.message || 'Something went wrong. Please try again.',
          confirmButtonColor: '#667eea',
        });
        console.error('Error:', error);
      },
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.shadowFormGroup.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched || this.submitted)
    );
  }

  getErrorMessage(fieldName: string): string {
    const field = this.shadowFormGroup.get(fieldName);
    if (field?.hasError('required')) return 'This field is required';
    if (field?.hasError('email')) return 'Invalid email format';
    if (field?.hasError('pattern'))
      return 'Invalid phone number (10 digits required)';
    if (field?.hasError('min')) return 'Team size must be at least 2';
    return '';
  }
  downloadBroucher() {
    const downloadLink = document.createElement('a');
    downloadLink.href = '/assets/event/theHiddenStars.pdf';
    downloadLink.download = 'ShadowsUnveiledBrochure.pdf';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
