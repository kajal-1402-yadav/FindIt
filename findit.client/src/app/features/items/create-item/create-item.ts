import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.html',
  styleUrls: ['./create-item.css'],
  standalone: false
})
export class CreateItem {

  title = '';
  description = '';
  location = '';
  type = 'Lost';
  showSuccessMessage = false;
  formSubmitted = false;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  createItem() {
    this.formSubmitted = true;

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.userId) {
      alert('Please log in first');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.title.trim() || !this.description.trim() || !this.location.trim()) {
      return; // Error messages will show in template
    }

    // Send as JSON, not FormData (backend expects [FromBody])
    const itemData = {
      Title: this.title,
      Description: this.description,
      Location: this.location,
      Type: this.type,
      UserId: user.userId
    };

    this.itemService.createItem(itemData).subscribe({
      next: () => {
        // Show success message
        this.showSuccessMessage = true;
        this.formSubmitted = false; // Reset validation state
        
        // Clear form
        this.title = '';
        this.description = '';
        this.location = '';
        this.type = 'Lost';
        
        // Force UI update
        this.cdr.detectChanges();
        
        // Hide message after 3 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Error creating item:', err);
        alert('Failed to create item. Please try again.');
      }
    });

  }

}
