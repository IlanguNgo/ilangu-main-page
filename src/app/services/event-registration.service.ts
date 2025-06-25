import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface RegistrationDetails {
  fullName: string;
  gender: string;
  mobileNumber: number;
  mailID: string;
  highestDegree: string;
}
@Injectable({
  providedIn: 'root',
})
export class EventRegistrationService {
  private baseUrl = 'api/register';
  constructor(private http: HttpClient) {}

  createNewRegister(
    registrationData: RegistrationDetails
  ): Observable<RegistrationDetails> {
    return this.http.post<RegistrationDetails>(this.baseUrl, registrationData);
  }
  getAllRegistrationDetails(): Observable<RegistrationDetails> {
    return this.http.get<RegistrationDetails>(this.baseUrl);
  }
}
