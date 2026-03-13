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
  lostItems: any[] = [];
  foundItems: any[] = [];
  returnedItems: any[] = [];
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
    
    this.itemService.getItems().subscribe({
      next: (data: any) => {
        
        // Ensure data is an array and filter out current user's items
        const allItems = Array.isArray(data) ? data : [];
        
        this.items = allItems.filter((item: any) => {
          return !this.currentUserId || item.userId !== this.currentUserId;
        });
        
        // Categorize items
        this.categorizeItems();
        
        this.loading = false;
        
        // Force change detection
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading items:', err);
        this.errorMessage = 'Failed to load items. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  categorizeItems() {
    this.lostItems = this.items.filter(item => item.type === 'Lost' && item.status === 'Open');
    this.foundItems = this.items.filter(item => item.type === 'Found' && item.status === 'Open');
    this.returnedItems = this.items.filter(item => item.status === 'Returned');
  }

}
