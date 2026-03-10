import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = '/api/items';

  constructor(private http: HttpClient) { }

  getItems() {
    return this.http.get(`${this.apiUrl}`);
  }

  getItemById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createItem(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateItem(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteItem(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
