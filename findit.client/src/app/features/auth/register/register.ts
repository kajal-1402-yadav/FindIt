import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  standalone: false
})
export class Register {

  registerForm: FormGroup;
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
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
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
    const password = this.registerForm.get('password')?.value;
    const requirements: { text: string; valid: boolean }[] = [];
    
    if (this.formSubmitted && password) {
      requirements.push({
        text: 'At least 6 characters',
        valid: password.length >= 6
      });
    }
    
    return requirements;
  }

  register() {
    this.formSubmitted = true;
    
    if (this.registerForm.invalid) {
      return;
    }

    const data = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
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
