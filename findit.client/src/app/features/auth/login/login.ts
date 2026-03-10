import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {

    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.login(data).subscribe({

      next: (res: any) => {

        localStorage.setItem('userId', res.userId);
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);

        this.router.navigate(['/']);

      },

      error: () => {
        alert('Invalid email or password');
      }

    });

  }

}
