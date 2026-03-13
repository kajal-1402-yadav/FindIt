import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  deleteAccount(data: any) {
    return this.http.post(`${this.apiUrl}/delete-account`, data);
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return !!user && user !== '{}';
  }

}
