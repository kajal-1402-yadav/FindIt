import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  standalone: false
})
export class Register {

  name = '';
  email = '';
  password = '';

  showPassword = false;   // 👈 ADD THIS

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  togglePassword() {       // 👈 ADD THIS
    this.showPassword = !this.showPassword;
  }

  register() {

    const data = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(data).subscribe({

      next: () => {

        this.router.navigate(['/login']);

      },

      error: () => {
        alert('Registration failed');
      }

    });

  }

}
