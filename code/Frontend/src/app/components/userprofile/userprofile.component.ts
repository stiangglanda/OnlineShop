import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { user_update } from 'src/app/models/user_update';
import { name_update } from 'src/app/models/name_update';
import { adress_update } from 'src/app/models/adress_update';

@Component({
	selector: 'app-userprofile',
	templateUrl: './userprofile.component.html',
	styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
	constructor(private fb: FormBuilder, private userService: UserService, private auth: AuthService, private router: Router) {}

	public model!: user_update;
	private updateModel!: user_update;
	private usernameFromToken: string = this.auth.getUsernameFromToken();
	private updateNameModel!: name_update;
  private updateAdressModel!: adress_update;

	userForm!: FormGroup;

	ngOnInit(): void {
		if (this.auth.isLoggedIn()) {
			this.userService.getUserByName(this.usernameFromToken).subscribe({
				next: (res) => {
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
					console.log(this.model);
				},
				error: (err) => {
					console.log(err);
				}
			});
		} else {
			this.router.navigate(['login']);
		}

		this.userForm = this.fb.group({
			username: ['', Validators.required],
			firstname: ['', Validators.required],
			lastname: ['', Validators.required],
			email: ['', Validators.required],
			street: ['', Validators.required],
			street_nr: ['', Validators.required],
			city: ['', Validators.required],
			plz: ['', Validators.required]
		});
	}

	update_Profile() {
		this.updateNameModel = {
			firstname: this.userForm.value.firstname,
			lastname: this.userForm.value.lastname
		};
    this.updateAdressModel = {
      city: this.userForm.value.city,
      plz: this.userForm.value.plz,
      street: this.userForm.value.street,
      street_nr: this.userForm.value.street_nr
    }


    this.userService.updateUserFullName(this.usernameFromToken, this.updateNameModel).subscribe(
      {
        next: (res) => 
        {
          console.log(res.firstname, res.lastname);
          console.log("Firstname Lastname Updated");
        },
        error: (err) => 
        {
          console.log(err);
        }
      }
    );     
    
    this.userService.updateUserAdress(this.usernameFromToken, this.updateAdressModel).subscribe(
      {
        next: (res) =>
        {
          console.log("adresse geupdated");
        },
        error: (err) =>
        {
          console.log(err);
        }
      }
    );
    

	}
}
