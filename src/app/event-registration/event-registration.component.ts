import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { EventRegistrationService } from '../services/event-registration.service';
import { ViewportScroller } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-event-registration',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-registration.component.html',
  styleUrl: './event-registration.component.scss',
})
export class EventRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private registrationService: EventRegistrationService,
    private scroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      gender: [''],
      highestDegree: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      mailID: ['', [Validators.required, Validators.email]],
      collegeName: ['', Validators.required],
    });
  }
  scrollTo(anchor: string) {
    this.scroller.scrollToAnchor(anchor);
  }
  onRegister() {
    if (this.registrationForm.valid) {
      console.log('Form is valid ...', this.registrationForm.value);
      this.registrationService
        .createNewRegister(this.registrationForm.value)
        .subscribe({
          next: (data) => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'You have successfully registered for the event. 🎉',
              confirmButtonText: 'OK',
            }).then((r) => console.log('Registration successfully', r));
            this.registrationForm.reset();
          },
          error: (err) => {
            console.error('Error in Registration:', err);
            Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: 'Something went wrong!',
              confirmButtonText: 'Try Again',
            }).then((r) => console.log('Error on Saving ', r));
          },
        });
    } else {
      console.log('Form is invalid ', this.registrationForm.value);
      Swal.fire({
        icon: 'error',
        title: 'Invalid Entry',
        text: 'Kindly Check if all the entries',
        confirmButtonText: 'Try Again',
      }).then((data) => {
        console.log('Something went wrong on data entries', data);
      });
    }
  }

  downloadBrochure() {
    console.log('Clicked Inside the Image ');
    const link = document.createElement('a');
    link.href = '/assets/event/broucher.pdf';
    link.download = 'The Power Of No Event Broucher.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(
      'The pdf is downloaded and the element is removed from the DOM'
    );
  }
}
