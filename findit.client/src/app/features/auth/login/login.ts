import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false
})
export class Login {

  email = '';
  password = '';
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

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

        const user = {
          userId: res.userId,
          name: res.name,
          email: res.email
        };

        localStorage.setItem('user', JSON.stringify(user));

        this.router.navigate(['/dashboard']);

      },

      error: () => {
        alert('Invalid email or password');
      }

    });

  }

}
