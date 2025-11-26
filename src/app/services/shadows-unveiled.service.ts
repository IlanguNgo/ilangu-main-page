import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ShadowsUnveiledService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:3000/shadows-unveiled';
  save(data: any): Observable<any> {
    return this.http.post(this.url, data);
    // return response
    // apicall this.http.post('url')
  }
  registerForm(data: FormData): Observable<any> {
    return this.http.post(this.url, data);
  }
}
