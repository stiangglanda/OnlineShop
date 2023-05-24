import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  loginImage: string = "../../../assets/images/login.jpg";
  loginBgImage: string = "../../../assets/images/loginBg.jpg";

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      repPassword: ['', Validators.required]
    });
  }

  onRegister()
  {
    if(this.registerForm.valid && this.registerForm.value.password === this.registerForm.value.repPassword)
    {
      this.auth.signUp(this.registerForm.value).subscribe({
        next: (res => {
          this.registerForm.reset();
          alert('success');
          this.router.navigate(['login']); 
        }),
        error: (err => { alert(err) })
      });
    }
  }
}
