import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { user_listing } from 'src/app/models/user_listing';
import { list_listing } from 'src/app/models/list_listing';
import { NgToastService } from 'ng-angular-popup';

@Component({
	selector: 'app-listings',
	templateUrl: './listings.component.html',
	styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
	constructor(private userService: UserService, private auth: AuthService, private router: Router, private user: UserService, private toast: NgToastService) {}

	public listingModel!: list_listing[];
	public model!: user_listing;
	private usernameFromToken: string = this.auth.getUsernameFromToken();

	ngOnInit(): void {
		if (this.auth.isLoggedIn()) {
			this.userService.getUserByName(this.usernameFromToken).subscribe({
				next: (res) => {
					this.model = {
						firstname: res.firstname,
						lastname: res.lastname,
						email: res.email
					};
				},
				error: (err) => {
					this.toast.error({ detail: 'ERROR', summary: err, duration: 5000 });
				}
			});

			this.user.getListingByName(this.usernameFromToken).subscribe({
				next: (res) => {
					this.listingModel = res.map((item: any) => ({
						articleID: item.id,
						name: item.name,
						description: item.description,
						price: item.price,
						images: item.images.map((images: any) => images.url)
					}));
				},
				error: (err) => {
					this.toast.error({ detail: 'ERROR', summary: err, duration: 5000 });
				}
			});
		} else {
			this.router.navigate(['login']);
		}
	}

	navigateToChange(id: string) {
		this.router.navigate(['change-article', id]);
	}
}
