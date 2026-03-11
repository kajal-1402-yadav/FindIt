import { Component } from '@angular/core';
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

  constructor(
    private itemService: ItemService,
    private router: Router
  ) { }

  createItem() {

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.userId) {
      alert('Please log in first');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.title.trim() || !this.description.trim() || !this.location.trim()) {
      alert("Please fill all required fields");
      return;
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
        alert("Item reported successfully");
        this.title = '';
        this.description = '';
        this.location = '';
        this.type = 'Lost';
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert("Failed to create item");
      }
    });

  }

}
