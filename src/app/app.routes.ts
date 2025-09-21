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
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'blogs',
    loadComponent: () =>
      import('./blog/blog.component').then((m) => m.BlogComponent),
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'ourwork',
    loadComponent: () =>
      import('./ourwork/ourwork.component').then((m) => m.OurworkComponent),
  },
  {
    path: 'volunteer',
    loadComponent: () =>
      import('./volunteer/volunteer.component').then(
        (m) => m.VolunteerComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./event-registration/event-registration.component').then(
        (m) => m.EventRegistrationComponent
      ),
  },
  {
    path: 'thehiddenstars',
    loadComponent: () =>
      import('./hidden-path/hidden-path.component').then(
        (m) => m.HiddenPathComponent
      ),
  },
  {
    path :"shadowsunveiled",
    loadComponent:()=>import('./shadowsunveiled/shadowsunveiled.component').then(m=>m.ShadowsunveiledComponent)
  }
];
