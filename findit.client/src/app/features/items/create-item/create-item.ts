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
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {

    const file = event.target.files[0];

    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        event.target.value = '';
        this.selectedFile = null;
        this.imagePreview = null;
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        event.target.value = '';
        this.selectedFile = null;
        this.imagePreview = null;
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(file);

    }

  }

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

    const formData = new FormData();

    formData.append('Title', this.title);
    formData.append('Description', this.description);
    formData.append('Location', this.location);
    formData.append('Type', this.type);
    formData.append('UserId', user.userId.toString());

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile, this.selectedFile.name);
    }

    this.itemService.createItem(formData).subscribe({

      next: () => {
        alert("Item reported successfully");
        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  
}
