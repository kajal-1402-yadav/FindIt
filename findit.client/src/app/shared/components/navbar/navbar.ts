import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: false
})
export class Navbar implements OnInit {

  isLoggedIn = false;

  // Delete account modal properties
  showDeleteModal = false;
  deleteForm = {
    email: '',
    password: ''
  };
  deleteError = '';

  // User menu dropdown properties
  showUserMenu = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    this.checkLogin();

    // 👇 update navbar on route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkLogin();
      }
    });

  }

  checkLogin() {
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!user;
  }

  logout() {
    // Clear all local storage data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any session cookies if possible
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    this.isLoggedIn = false;
    this.showUserMenu = false; // Close dropdown
    this.router.navigate(['/']);
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  openDeleteAccountModal() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.deleteForm.email = user.email || '';
    this.deleteForm.password = '';
    this.deleteError = '';
    this.showUserMenu = false; // Close dropdown
    this.showDeleteModal = true;
  }

  closeDeleteAccountModal() {
    this.showDeleteModal = false;
    this.deleteForm = {
      email: '',
      password: ''
    };
    this.deleteError = '';
  }

  deleteAccount() {
    if (!this.deleteForm.email || !this.deleteForm.password) {
      this.deleteError = 'Please fill in all fields';
      return;
    }

    this.authService.deleteAccount(this.deleteForm).subscribe({
      next: () => {
        // Account deleted successfully - perform comprehensive cleanup
        this.performCompleteLogout();
        
        this.showDeleteModal = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        this.deleteError = err.error?.message || 'Failed to delete account. Please check your credentials and try again.';
      }
    });
  }

  private performCompleteLogout() {
    // Clear all local storage data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any session cookies if possible
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    this.isLoggedIn = false;
    this.showUserMenu = false;
  }

}
