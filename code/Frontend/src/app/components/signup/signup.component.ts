import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { user_signup } from 'src/app/models/user_signup';
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
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      city: ['', Validators.required],
      plz: ['', Validators.required],
      street: ['', Validators.required],
      street_nr: ['', Validators.required],
      rep_password: ['', Validators.required]
    });
  }

  onRegister()
  {
    if(this.registerForm.valid)
    {
      const model: user_signup = this.create_user_Model();
      try{
        this.auth.signUp(model).subscribe({
            next: (res => {
                this.registerForm.reset();
                alert('You have Registered!');
                this.router.navigate( ['login'] );
            }),
            error: (err => { console.log(err); })
        });
      }catch(err)
      {
        console.log(err);
      }
    }else { alert('Password does not match'); }
  }

  create_user_Model(): user_signup
  {
    const model: user_signup = {
      username: this.registerForm.value.username,
      firstname: this.registerForm.value.firstname,
      lastname: this.registerForm.value.lastname,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      city: this.registerForm.value.city,
      plz: this.registerForm.value.plz,
      street: this.registerForm.value.street,
      street_nr: this.registerForm.value.street_nr
    };

    return model;
  }
}
