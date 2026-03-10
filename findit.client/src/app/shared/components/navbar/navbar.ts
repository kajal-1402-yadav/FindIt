import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: false
})
export class Navbar implements OnInit {

  isLoggedIn = false;

  constructor(private router: Router) { }

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
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

}
