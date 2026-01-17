import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  authSer=inject(AuthService);
  router=inject(Router);
  fb=inject(FormBuilder);

  loginForm!: FormGroup;
  errorMsg='';

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(){
    if (!this.loginForm.valid) {
      this.errorMsg = 'Please fill in all required fields';
      return;
    }

    this.authSer.login(this.loginForm.value).subscribe({
      next:(res:any)=>{
        this.authSer.saveToken(res.token);
        this.router.navigate(['/admin/inventory']);
      },
      error:(err)=>{
        this.errorMsg=err.error.message;
      }
    });
  }
}
