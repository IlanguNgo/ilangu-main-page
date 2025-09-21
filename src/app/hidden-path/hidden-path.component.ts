import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HiddenStarService } from '../services/hidden-star.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hidden-path',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hidden-path.component.html',
  styleUrls: ['./hidden-path.component.scss'],
})
export class HiddenPathComponent implements OnInit {
  hiddenStar!: FormGroup;

  // ✅ topics with mapped categories
  eventTopics = [
    {
      id: 1,
      name: 'Teaching methods to implement moral values to primary students.',
      category: 'Primary',
    },
    {
      id: 2,
      name: 'How can we identify students who needs more attention.',
      category: 'Primary',
    },
    {
      id: 3,
      name: 'A single parent student who scored good marks, got suddenly demotivated in studies. (Substance abuse)',
      category: 'Middle School',
    },
    {
      id: 4,
      name: 'A student who repeatedly disrespects teachers and acts violently.',
      category: 'Middle School',
    },
    {
      id: 5,
      name: 'A student is inactive, lonely, and addicted to substance abuse.',
      category: 'Middle School',
    },
    {
      id: 6,
      name: 'How to implement moral values and ill effects of drug abuse during normal classes.',
      category: 'Higher Secondary',
    },
    {
      id: 7,
      name: 'Visible difficulties in handling students lacking moral values.',
      category: 'Higher Secondary',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private hiddenService: HiddenStarService
  ) {}

  ngOnInit(): void {
    this.hiddenStar = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      schoolName: ['', Validators.required],
      topic: ['', Validators.required],
      comment : [''],
      ppt: [null, Validators.required], // ✅ file required
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.hiddenStar.get('ppt')?.setErrors({ required: true });
      return;
    }

    // ✅ Check file type (.ppt or .pptx)
    const allowedTypes = [
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    ];

    if (!allowedTypes.includes(file.type)) {
      this.hiddenStar.get('ppt')?.setErrors({ invalidType: true });
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please upload only .ppt or .pptx files',
        confirmButtonText: 'OK',
      });
    } else {
      this.hiddenStar.patchValue({ ppt: file });
      this.hiddenStar.get('ppt')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.hiddenStar.valid) {
      const formData = new FormData();
      formData.append('name', this.hiddenStar.get('name')?.value);
      formData.append('gender', this.hiddenStar.get('gender')?.value);
      formData.append('schoolName', this.hiddenStar.get('schoolName')?.value);
      formData.append('email', this.hiddenStar.get('email')?.value);
      formData.append('phoneNumber', this.hiddenStar.get('phoneNumber')?.value);
      formData.append('comment', this.hiddenStar.get('comment')?.value)
      // ✅ topic + category
      const selectedTopicId = this.hiddenStar.get('topic')?.value;
      const selectedTopic = this.eventTopics.find(
        (t) => t.id === selectedTopicId
      );
      if (selectedTopic) {
        formData.append('topic', selectedTopic.name);
        formData.append('category', selectedTopic.category);
      }

      // ✅ add ppt file
      const file = this.hiddenStar.get('ppt')?.value;
      if (file) {
        formData.append('ppt', file);
      }
     // Debugging: print formData contents
console.log('--- FormData Contents ---');
for (const [key, value] of formData.entries()) {
  console.log(key, value);
}
      this.hiddenService.registerForm(formData).subscribe({
        next: (res) => {
          console.log('Server response:', res);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Registered For The Event',
            confirmButtonText: 'OK',
          });
          this.hiddenStar.reset();
        },
        error: (err) => {
          console.error('Upload failed:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Oops!, something went wrong',
            confirmButtonText: 'Retry',
          });
        },
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Form is not Valid',
        text: 'Kindly check all the fields and upload a PPT/PPTX file',
        confirmButtonText: 'Ok',
      });
    }
  }
  downloadBroucher(){
    const downloadLink = document.createElement('a');
    downloadLink.href = "/assets/event/theHiddenStars.pdf";
    downloadLink.download = "TheHiddenStarsBrochure.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
