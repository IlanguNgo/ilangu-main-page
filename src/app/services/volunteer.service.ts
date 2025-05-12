import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Volunteer Interface (optional but good)
export interface Volunteer {
  name: string;
  secondName: string;
  email: string;
  phoneNumber: number;
  comment: string;
  subscribe?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class VolunteerService {
  private baseUrl = 'http://192.168.29.74:3000/volunteers'; // 🔥 Your backend URL

  constructor(private http: HttpClient) {}

  // POST: Create volunteer
  createVolunteer(volunteer: Volunteer): Observable<Volunteer> {
    return this.http.post<Volunteer>(this.baseUrl, volunteer);
  }

  // GET: Fetch all volunteers
  getVolunteers(): Observable<Volunteer[]> {
    return this.http.get<Volunteer[]>(this.baseUrl);
  }
}
