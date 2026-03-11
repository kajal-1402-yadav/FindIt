import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { ClaimService } from '../../../core/services/claim.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.html',
  styleUrls: ['./item-details.css'],
  standalone: false
})
export class ItemDetails implements OnInit {

  itemId!: number;
  item: any;

  claims: any[] = [];

  currentUserId: number | null = null;

  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.userId || null;

    this.itemId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Loading item details for ID:', this.itemId);

    this.loadItem();
    this.loadClaims();

  }

  loadItem() {
    console.log('Loading item...');
    this.itemService.getItem(this.itemId).subscribe({
      next: (data) => {
        console.log('Item loaded:', data);
        this.item = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Final item:', this.item);
        console.log('Loading state:', this.loading);
      },
      error: (err) => {
        console.error('Error loading item:', err);
        this.errorMessage = 'Failed to load item details. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

  }

  loadClaims() {
    console.log('Loading claims...');
    this.claimService.getClaimsForItem(this.itemId).subscribe({
      next: (data) => {
        console.log('Claims loaded:', data);
        this.claims = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading claims:', err);
      }
    });

  }

  approveClaim(claimId: number) {

    this.claimService.approveClaim(claimId).subscribe({
      next: (res: any) => {

        alert(res.message);

        this.loadItem();
        this.loadClaims();

      }
    });

  }

  rejectClaim(claimId: number) {

    this.claimService.rejectClaim(claimId).subscribe({
      next: () => {

        alert("Claim rejected");

        this.loadClaims();

      }
    });

  }

}
