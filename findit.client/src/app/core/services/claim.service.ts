import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  private apiUrl = '/api/claims';

  constructor(private http: HttpClient) { }

  createClaim(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getClaimsForItem(itemId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/item/${itemId}`);
  }

  getClaimsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  getClaimedItems(userId: number): Observable<any> {
    // Use the existing endpoint and filter for approved claims
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  approveClaim(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectClaim(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {});
  }
}
