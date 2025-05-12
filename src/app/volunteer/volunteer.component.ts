import { Component, OnInit } from '@angular/core';
import { VolunteerService, Volunteer } from '../services/volunteer.service';
import Swal from 'sweetalert2';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  EmailValidator,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
@Component({
  selector: 'app-volunteer',
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './volunteer.component.html',
  styleUrl: './volunteer.component.scss',
})
export class VolunteerComponent {
  enrollmentForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private volunteerService: VolunteerService
  ) {
    this.enrollmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      secondName: [''],
      email: ['', [, Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      subscribe: [true],
      comment: [''],
    });
  }
  // ngOnInit(): void {
  //   const volunteers = this.loadVolunteers();
  //   console.log('Volunteers : ', volunteers);
  // }
  onSubmit() {
    if (this.enrollmentForm.valid) {
      this.volunteerService
        .createVolunteer(this.enrollmentForm.value)
        .subscribe({
          next: (res) => {
            console.log('Volunteer created:', res);
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Volunteer enrolled successfully 🎉',
              confirmButtonText: 'OK',
            });
            this.enrollmentForm.reset(); // Clear form after success
          },
          error: (err) => {
            console.error('Error creating volunteer:', err);
            Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: 'Something went wrong!',
              confirmButtonText: 'Try Again',
            });
          },
        });
    } else {
      alert('Form is invalid!');
    }
  }

  loadVolunteers() {
    this.volunteerService.getVolunteers().subscribe({
      next: (data) => {
        console.log('All Volunteers:', data);
      },
      error: (err) => {
        console.error('Error fetching volunteers:', err);
      },
    });
  }
}
