import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { OurworkComponent } from './ourwork/ourwork.component';
import { VolunteerComponent } from './volunteer/volunteer.component';
import { BlogComponent } from './blog/blog.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'about',
    component: AboutComponent,
  },
  { path: 'blogs', component: BlogComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'ourwork', component: OurworkComponent },
  { path: 'volunteer', component: VolunteerComponent },
];
