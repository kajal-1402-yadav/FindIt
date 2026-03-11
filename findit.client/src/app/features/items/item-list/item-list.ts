import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ItemService } from '../../../core/services/item.service';

@Component({
  selector: 'app-item-list',
  standalone: false,
  templateUrl: './item-list.html',
  styleUrls: ['./item-list.css']
})
export class ItemList implements OnInit {

  items: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  currentUserId: number | null = null;

  constructor(
    private itemService: ItemService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.userId || null;

    this.loadItems();

  }

  loadItems() {
    this.loading = true;
    this.errorMessage = '';
    console.log('Loading items...');
    
    this.itemService.getItems().subscribe({
      next: (data: any) => {
        console.log('Items loaded:', data);
        console.log('Data type:', typeof data);
        console.log('Data length:', data?.length);
        
        // Ensure data is an array
        this.items = Array.isArray(data) ? data : [];
        this.loading = false;
        
        // Force change detection
        this.cdr.detectChanges();
        
        console.log('Final items:', this.items);
        console.log('Loading state:', this.loading);
      },
      error: (err: any) => {
        console.error('Error loading items:', err);
        this.errorMessage = 'Failed to load items. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

}
