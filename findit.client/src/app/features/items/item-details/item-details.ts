import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-details',
  template: '<div></div>',
  standalone: false
})
export class ItemDetails implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Redirect to dashboard since item details functionality has been removed
    this.router.navigate(['/dashboard']);
  }

}
