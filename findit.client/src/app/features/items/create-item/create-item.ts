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
    console.log('createItem called');
    this.formSubmitted = true;

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.userId) {
      alert('Please log in first');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.title.trim() || !this.description.trim() || !this.location.trim()) {
      console.log('Validation failed:', { title: this.title, description: this.description, location: this.location });
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

    console.log('Creating item:', itemData);
    this.itemService.createItem(itemData).subscribe({
      next: () => {
        console.log('Success callback reached');
        // Show success message
        this.showSuccessMessage = true;
        this.formSubmitted = false; // Reset validation state
        
        // Clear form
        this.title = '';
        this.description = '';
        this.location = '';
        this.type = 'Lost';
        
        console.log('Success message set to:', this.showSuccessMessage);
        
        // Force UI update
        this.cdr.detectChanges();
        
        // Hide message after 3 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        alert("Failed to create item");
      }
    });

  }

}
