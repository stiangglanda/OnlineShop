import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { user_login } from 'src/app/models/user_login';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService,) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const model: user_login = this.create_user_Model();
      this.auth.login(model).subscribe({
        next: (res => {
          this.loginForm.reset();
          this.auth.storeToken(res.token);
          this.router.navigate( ['article-list'] ).then(() => {
            window.location.reload();
          });
        }),
        error:(err => { console.log(err) })
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      alert('Your form is invalid');
    }
  }

  create_user_Model(): user_login
  {
    const model: user_login = {
      emailOrUsername: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    return model;
  }
}
