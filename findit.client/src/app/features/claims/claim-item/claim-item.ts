import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService } from '../../../core/services/claim.service';
import { ItemService } from '../../../core/services/item.service';

@Component({
  selector: 'app-claim-item',
  templateUrl: './claim-item.html',
  styleUrls: ['./claim-item.css'],
  standalone: false
})
export class ClaimItem implements OnInit {

  itemId!: number;
  item: any;

  message = '';
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private claimService: ClaimService,
    private itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.itemId = Number(this.route.snapshot.paramMap.get('itemId'));
    console.log('Loading claim item for ID:', this.itemId);

    this.loadItem();
  }

  loadItem() {
    console.log('Loading item for claim...');
    this.itemService.getItem(this.itemId).subscribe({
      next: (data) => {
        console.log('Item loaded for claim:', data);
        this.item = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Final claim item:', this.item);
        console.log('Loading state:', this.loading);
      },
      error: (err) => {
        console.error('Error loading item for claim:', err);
        this.errorMessage = 'Failed to load item. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

  }

  submitClaim() {

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.userId) {
      alert("Please login first");
      this.router.navigate(['/login']);
      return;
    }

    if (!this.message.trim()) {
      alert("Please write a message explaining why this item is yours.");
      return;
    }

    const claim = {
      itemId: this.itemId,
      userId: user.userId,
      message: this.message
    };

    this.claimService.createClaim(claim).subscribe({

      next: () => {

        alert("Claim submitted successfully!");

        this.router.navigate(['/dashboard']);

      },

      error: (err) => {
        console.error(err);
        alert("Failed to submit claim");
      }

    });

  }

}
