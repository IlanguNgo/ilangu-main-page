import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NgbCarousel,
  NgbCarouselModule,
  NgbSlideEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, RouterLink, NgbCarouselModule], // ✅ Add NgbCarouselModule here
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor() {}

  images = ['assets/homepage/join_us.webp', 'assets/images/drug-free.webp'];
  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

  onSlide(event: NgbSlideEvent) {
    // Optional: handle slide events
  }
}
