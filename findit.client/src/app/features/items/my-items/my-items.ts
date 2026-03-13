import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { ClaimService } from '../../../core/services/claim.service';

@Component({
  selector: 'app-my-items',
  standalone: false,
  templateUrl: './my-items.html',
  styleUrls: ['./my-items.css']
})
export class MyItems implements OnInit {

  items: any[] = [];
  claimedItems: any[] = [];
  loading: boolean = true;
  claimedLoading: boolean = true;
  errorMessage: string = '';
  claimedErrorMessage: string = '';
  currentUserId: number | null = null;
  deleteSuccessMessage: string = '';

  // Claim modal properties
  // Map of itemId -> list of claims (only pending claims are stored)
  itemClaims: Record<number, any[]> = {};
  // Modal claim selection state
  modalClaims: any[] = [];
  selectedClaim: any = null;
  showModal: boolean = false;

  // Edit modal properties
  showEditModal: boolean = false;
  editForm: any = {
    Title: '',
    Description: '',
    Location: '',
    Type: 'Lost'
  };
  editingItem: any = null;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private claimService: ClaimService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user || !user.userId) {
      console.error('No user found or invalid user data');
      this.loading = false;
      this.claimedLoading = false;
      this.errorMessage = 'Please login to view your items';
      this.claimedErrorMessage = 'Please login to view your claimed items';
      this.cdr.detectChanges();
      return;
    }

    this.currentUserId = user.userId;

    if (this.currentUserId) {
      this.loadReportedItems(this.currentUserId);
      this.loadClaimedItems(this.currentUserId);
      this.loadItemClaims(this.currentUserId);
    }

  }

  private loadReportedItems(userId: number) {

    this.itemService.getUserItems(userId).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading your reported items:', err);
        this.errorMessage = 'Failed to load your reported items. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

  }

  private loadClaimedItems(userId: number) {

    this.claimService.getClaimedItems(userId).subscribe({
      next: (data: any[]) => {
        
        // Process claims data
        this.claimedItems = (data || [])
          .map((claim: any) => ({
            ...claim.item,
            claimStatus: claim.status?.toLowerCase() === 'approved' ? 'Approved by reporter' : 
                        claim.status?.toLowerCase() === 'denied' || claim.status?.toLowerCase() === 'rejected' ? 'Denied by reporter' : 
                        `Status: ${claim.status}`,
            claimId: claim.id,
            claimMessage: claim.message,
            statusType: claim.status?.toLowerCase() === 'rejected' ? 'denied' : claim.status?.toLowerCase() || 'unknown'
          }));

        this.claimedLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading your claimed items:', err);
        this.claimedErrorMessage = 'Failed to load your claimed items. Please try again.';
        this.claimedLoading = false;
        this.cdr.detectChanges();
      }
    });

  }

  private loadItemClaims(userId: number) {
    // Load claims for user's reported items
    this.itemService.getUserItems(userId).subscribe({
      next: (items) => {
        this.itemClaims = {};
        
        // Load claims for each item
        items.forEach((item: any) => {
          this.claimService.getClaimsForItem(item.id).subscribe({
            next: (claims: any[]) => {
              if (claims && claims.length > 0) {
                // Store only pending claims for notification cards
                this.itemClaims[item.id] = claims
                  .filter((claim: any) => claim.status === 'Pending')
                  .map((claim: any) => ({
                    ...claim,
                    item: item
                  }));
              }
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error loading claims for item:', item.id, err);
            }
          });
        });
      },
      error: (err) => {
        console.error('Error loading items for claims:', err);
      }
    });
  }

  hasPendingClaims(itemId: number): boolean {
    const claims = this.itemClaims[itemId] || [];
    return claims.some((claim: any) => claim.status === 'Pending');
  }

  // Edit and Delete methods
  openEditModal(item: any) {
    this.editingItem = item;
    this.editForm = {
      Title: item.title,
      Description: item.description,
      Location: item.location,
      Type: item.type
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingItem = null;
    this.editForm = {
      Title: '',
      Description: '',
      Location: '',
      Type: 'Lost'
    };
  }

  updateItem() {
    if (!this.editingItem) return;

    const updatedItem = {
      ...this.editForm,
      UserId: this.currentUserId
    };

    this.itemService.updateItem(this.editingItem.id, updatedItem).subscribe({
      next: () => {
        this.closeEditModal();
        if (this.currentUserId) {
          this.loadReportedItems(this.currentUserId);
        }
      },
      error: (err: any) => {
        console.error('Error updating item:', err);
        if (err.status === 405 || err.status === 404) {
          // Update functionality is not yet available on server
          this.closeEditModal();
        } else {
          // Failed to update item
          this.closeEditModal();
          // Show validation error message if available
          if (err.error && err.error.errors) {
            const validationErrors = Object.values(err.error.errors).flat();
            if (validationErrors.length > 0) {
              alert(`Validation failed: ${validationErrors.join(', ')}`);
            }
          } else {
            alert('Failed to update item. Please try again.');
          }
        }
      }
    });
  }

  deleteItem(itemId: number) {
    this.itemService.deleteItem(itemId).subscribe({
      next: () => {
        this.closeEditModal();
        if (this.currentUserId) {
          this.loadReportedItems(this.currentUserId);
        }
      },
      error: (err: any) => {
        console.error('Error deleting item:', err);
        if (err.status === 405 || err.status === 404) {
          // Delete functionality is not yet available on server
          this.closeEditModal();
        } else {
          // Failed to delete item
          this.closeEditModal();
        }
      }
    });
  }

  openClaimModal(claim: any) {
    this.selectedClaim = claim;
    this.showModal = true;
  }

  openClaimModalForItem(itemId: number) {
    // Open modal with all pending claims for this item
    const claims = this.itemClaims[itemId] || [];
    if (claims.length > 0) {
      this.modalClaims = claims;
      this.selectedClaim = claims[0];
      this.showModal = true;
    }
  }

  selectClaim(claim: any) {
    this.selectedClaim = claim;
  }

  closeModal() {
    this.showModal = false;
    this.selectedClaim = null;
    this.modalClaims = [];
  }

  approveClaim() {
    if (!this.selectedClaim) return;

    this.claimService.approveClaim(this.selectedClaim.id).subscribe({
      next: () => {
        this.closeModal();
        // Refresh both reported items and claims to remove approved claim from card
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.userId) {
          this.loadReportedItems(user.userId);
          this.loadItemClaims(user.userId);
        }
      },
      error: (err) => {
        console.error('Error approving claim:', err);
        alert('Failed to approve claim. Please try again.');
      }
    });
  }

  denyClaim() {
    if (!this.selectedClaim) return;

    this.claimService.rejectClaim(this.selectedClaim.id).subscribe({
      next: () => {
        alert('Claim denied successfully! The item is now available for others to claim.');
        this.closeModal();
        // Refresh both reported items and claims to remove denied claim from card
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.userId) {
          this.loadReportedItems(user.userId);
          this.loadItemClaims(user.userId);
        }
      },
      error: (err) => {
        console.error('Error denying claim:', err);
        alert('Failed to deny claim. Please try again.');
      }
    });
  }

}

