import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginImage: string = "../../../assets/images/login.jpg";
  loginBgImage: string = "../../../assets/images/loginBg.jpg";

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      password: ['', Validators.required],
      username: ['', Validators.required]
    });
  }

  onLogin(){
    if(this.loginForm.valid)
    {
      console.log(this.loginForm.value)
      this.loginForm.reset();
    }else
    {
      ValidateForm.validateAllFormFields(this.loginForm);
      alert("Your form is invalid");
    }
  }

}
