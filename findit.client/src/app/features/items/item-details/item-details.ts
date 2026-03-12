import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { ClaimService } from '../../../core/services/claim.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.html',
  styleUrls: ['./item-details.css'],
  standalone: false
})
export class ItemDetails implements OnInit {

  item: any = null;
  claims: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private claimService: ClaimService
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.userId || null;

    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.loadItemDetails(+itemId);
      this.loadClaims(+itemId);
    } else {
      this.errorMessage = 'Item ID not found';
      this.loading = false;
    }
  }

  private loadItemDetails(itemId: number) {
    this.itemService.getItem(itemId).subscribe({
      next: (data: any) => {
        this.item = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading item details:', err);
        this.errorMessage = 'Failed to load item details';
        this.loading = false;
      }
    });
  }

  private loadClaims(itemId: number) {
    this.claimService.getClaimsForItem(itemId).subscribe({
      next: (data: any) => {
        this.claims = data || [];
      },
      error: (err: any) => {
        console.error('Error loading claims:', err);
        this.claims = [];
      }
    });
  }

  approveClaim(claimId: number) {
    this.claimService.approveClaim(claimId).subscribe({
      next: () => {
        alert('Claim approved successfully!');
        this.loadClaims(this.item.id);
      },
      error: (err) => {
        console.error('Error approving claim:', err);
        alert('Failed to approve claim. Please try again.');
      }
    });
  }

  rejectClaim(claimId: number) {
    this.claimService.rejectClaim(claimId).subscribe({
      next: () => {
        alert('Claim rejected successfully!');
        this.loadClaims(this.item.id);
      },
      error: (err) => {
        console.error('Error rejecting claim:', err);
        alert('Failed to reject claim. Please try again.');
      }
    });
  }

}
