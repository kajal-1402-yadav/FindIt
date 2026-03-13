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
  formSubmitted = false;
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private claimService: ClaimService,
    private itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.itemId = Number(this.route.snapshot.paramMap.get('itemId'));

    this.loadItem();
  }

  loadItem() {
    this.itemService.getItem(this.itemId).subscribe({
      next: (data) => {
        this.item = data;
        this.loading = false;
        this.cdr.detectChanges();
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

    this.formSubmitted = true;

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.userId) {
      alert("Please login first");
      this.router.navigate(['/login']);
      return;
    }

    if (!this.message.trim()) {
      // Validation error will show in the template
      return;
    }

    const claim = {
      itemId: this.itemId,
      userId: user.userId,
      message: this.message
    };

    this.claimService.createClaim(claim).subscribe({

      next: () => {

        this.successMessage = 'Claim submitted successfully!';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 4000);

      },

      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to submit claim. Please try again.';
      }

    });

  }

}
