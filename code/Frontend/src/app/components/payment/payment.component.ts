import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { user_update } from 'src/app/models/user_update';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css', ]
})
export class PaymentComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ){}

  public model!: user_update;
  private updateModel!: user_update;
  private usernameFromToken: string = this.auth.getUsernameFromToken();

  userForm!: FormGroup;   

  ngOnInit(): void {
    if(this.auth.isLoggedIn())
    {
      this.userService.getUserByName(this.usernameFromToken).subscribe({
        next: (res => {
          this.model = {
            username: res.username,
            firstname: res.firstname,
            lastname: res.lastname,
            email: res.email,
            city: res.address.city,
            plz: res.address.plz,
            street: res.address.street,
            street_nr: res.address.street_nr
          };
        }),
        error: (err => { console.log(err) })
      });
    }else
    {
      this.router.navigate( ['login'] );
    }

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  update_Profile(){

    this.updateModel = {
      username: this.userForm.value.username,
      firstname: this.userForm.value.firstname,
      lastname: this.userForm.value.lastname,
      email: this.userForm.value.email,
      city: this.model.city,
      plz: this.model.plz,
      street: this.model.street,
      street_nr: this.model.street_nr
    };

    this.userService.updateUserByName(this.usernameFromToken, this.updateModel).subscribe({
      next: (res => {
        alert('you changed your data');
      }),
      error: (err => { console.log(err) })
    });
  }

}
