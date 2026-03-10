import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone:false
})
export class Navbar implements OnInit {

  isLoggedIn = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin() {
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!user;
  }

  logout() {
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

}
