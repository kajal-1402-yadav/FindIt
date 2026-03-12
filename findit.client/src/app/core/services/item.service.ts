import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = '/api/items';
  constructor(private http: HttpClient) { }

  getItems(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getItem(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createItem(item: any): Observable<any> {
    console.log('Creating item, type:', typeof item, 'is FormData:', item instanceof FormData);
    return this.http.post(this.apiUrl, item);
  }

  getUserItems(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  updateItem(id: number, item: any): Observable<any> {
    // Try POST method since PUT might not be implemented
    return this.http.post(`${this.apiUrl}/${id}/update`, item);
  }

  deleteItem(id: number): Observable<any> {
    // Try POST method since DELETE might not be implemented
    return this.http.post(`${this.apiUrl}/${id}/delete`, {});
  }
}
