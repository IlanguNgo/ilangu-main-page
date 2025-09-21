import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HiddenStarService {
  private readonly url = 'http://localhost:3001/hidden-stars';

  constructor(private http: HttpClient) {}

  registerForm(data: FormData): Observable<any> {
    return this.http.post(this.url, data);
  }
}