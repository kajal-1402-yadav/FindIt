
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ItemService } from '../../../core/services/item.service';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.html',
  styleUrls: ['./my-items.css'],
  standalone:false
})
export class MyItems implements OnInit {

  items: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private itemService: ItemService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.userId) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    console.log('Loading my items...');
    
    this.itemService.getUserItems(user.userId).subscribe({
      next: (data) => {
        console.log('My items loaded:', data);
        this.items = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Final my items:', this.items);
        console.log('Loading state:', this.loading);
      },
      error: (err) => {
        console.error('Error loading my items:', err);
        this.errorMessage = 'Failed to load your items. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });




  }



}
