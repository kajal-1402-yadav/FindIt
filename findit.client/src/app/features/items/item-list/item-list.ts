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
    console.log('Loading items...');
    
    this.itemService.getItems().subscribe({
      next: (data: any) => {
        console.log('Items loaded:', data);
        console.log('Data type:', typeof data);
        console.log('Data length:', data?.length);
        
        // Ensure data is an array and filter out current user's items
        const allItems = Array.isArray(data) ? data : [];
        console.log('Current user ID:', this.currentUserId);
        console.log('First item full structure:', allItems[0]);
        console.log('All items with their UserIds:', allItems.map(item => ({id: item.id, userId: item.userId})));
        
        this.items = allItems.filter((item: any) => {
          const shouldInclude = !this.currentUserId || item.userId !== this.currentUserId;
          console.log(`Item ${item.id}: userId=${item.userId}, CurrentUserId=${this.currentUserId}, Include=${shouldInclude}`);
          return shouldInclude;
        });
        
        // Categorize items
        this.categorizeItems();
        
        console.log(`Filtered ${allItems.length} items to ${this.items.length}`);
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

  categorizeItems() {
    this.lostItems = this.items.filter(item => item.type === 'Lost' && item.status === 'Open');
    this.foundItems = this.items.filter(item => item.type === 'Found' && item.status === 'Open');
    this.returnedItems = this.items.filter(item => item.status === 'Returned');
    
    console.log('Categorized items:', {
      lost: this.lostItems.length,
      found: this.foundItems.length,
      returned: this.returnedItems.length
    });
  }

}
