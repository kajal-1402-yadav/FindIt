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
  itemClaims: any[] = [];
  showModal: boolean = false;
  selectedClaim: any = null;

  // Edit modal properties
  showEditModal: boolean = false;
  editForm: any = {
    title: '',
    description: '',
    location: '',
    type: 'Lost'
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
    console.log('User data from localStorage:', user);

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
    console.log('Current user ID:', this.currentUserId);

    console.log('Loading my reported items and claimed items...');

    if (this.currentUserId) {
      this.loadReportedItems(this.currentUserId);
      this.loadClaimedItems(this.currentUserId);
      this.loadItemClaims(this.currentUserId);
    }

  }

  private loadReportedItems(userId: number) {

    this.itemService.getUserItems(userId).subscribe({
      next: (data) => {
        console.log('My reported items loaded:', data);
        this.items = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Final my reported items:', this.items);
        console.log('Reported items loading state:', this.loading);
      },
      error: (err) => {
        console.error('Error loading my reported items:', err);
        this.errorMessage = 'Failed to load your reported items. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

  }

  private loadClaimedItems(userId: number) {

    this.claimService.getClaimedItems(userId).subscribe({
      next: (data) => {
        console.log('My claims loaded:', data);
        console.log('Claims data structure:', data);
        
        // Show all claims for debugging
        if (data && data.length > 0) {
          console.log('First claim structure:', data[0]);
          console.log('All claim statuses:', data.map((c: any) => ({ id: c.id, status: c.status })));
        }
        
        // Show ALL claims to debug the issue
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

        console.log('Final claimed items (approved and denied claims only):', this.claimedItems);
        console.log('Claimed items loading state:', this.claimedLoading);
      },
      error: (err) => {
        console.error('Error loading claimed items:', err);
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
        this.itemClaims = [];
        
        // Load claims for each item
        items.forEach((item: any) => {
          this.claimService.getClaimsForItem(item.id).subscribe({
            next: (claims) => {
              if (claims && claims.length > 0) {
                // Add pending claims to the list
                const pendingClaims = claims.filter((claim: any) => claim.status === 'Pending');
                pendingClaims.forEach((claim: any) => {
                  this.itemClaims.push({
                    ...claim,
                    item: item
                  });
                });
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
    return this.itemClaims.some((claim: any) => claim.itemId === itemId && claim.status === 'Pending');
  }

  // Edit and Delete methods
  openEditModal(item: any) {
    this.editingItem = item;
    this.editForm = {
      title: item.title,
      description: item.description,
      location: item.location,
      type: item.type
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingItem = null;
    this.editForm = {
      title: '',
      description: '',
      location: '',
      type: 'Lost'
    };
  }

  updateItem() {
    if (!this.editingItem) return;

    const updatedItem = {
      ...this.editForm,
      id: this.editingItem.id
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
          // Update functionality is not yet available on the server
          this.closeEditModal();
        } else {
          // Failed to update item
          this.closeEditModal();
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
    // Find the first pending claim for this item
    const claim = this.itemClaims.find(c => c.itemId === itemId && c.status === 'Pending');
    if (claim) {
      this.openClaimModal(claim);
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedClaim = null;
  }

  approveClaim() {
    if (!this.selectedClaim) return;

    this.claimService.approveClaim(this.selectedClaim.id).subscribe({
      next: () => {
        alert('Claim approved successfully!');
        this.closeModal();
        this.loadItemClaims(JSON.parse(localStorage.getItem('user') || '{}').userId);
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
        this.loadItemClaims(JSON.parse(localStorage.getItem('user') || '{}').userId);
      },
      error: (err) => {
        console.error('Error denying claim:', err);
        alert('Failed to deny claim. Please try again.');
      }
    });
  }

}

