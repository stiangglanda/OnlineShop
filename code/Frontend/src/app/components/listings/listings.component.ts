import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { user_update } from 'src/app/models/user_update';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ){}

  public model!: user_update;
  private updateModel!: user_update;
  private usernameFromToken: string = this.auth.getUsernameFromToken(); 

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
  }
}
