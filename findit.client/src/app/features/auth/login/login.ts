import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false
})
export class Login {

  loginForm: FormGroup;
  showPassword = false;
  formSubmitted = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]]
    });
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) return null;
    
    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { invalidEmail: true };
    }
    return null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;
    
    if (password.length < 6) {
      return { minlength: { requiredLength: 6, actualLength: password.length } };
    }
    
    return null;
  }

  getPasswordValidationMessage(): { text: string; valid: boolean }[] {
    const password = this.loginForm.get('password')?.value;
    const requirements: { text: string; valid: boolean }[] = [];
    
    if (this.formSubmitted && password) {
      requirements.push({
        text: 'At least 6 characters',
        valid: password.length >= 6
      });
    }
    
    return requirements;
  }

  login() {
    this.formSubmitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }

    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
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
