import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { user_update } from 'src/app/models/user_update';
import { NgToastService } from 'ng-angular-popup';

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
	constructor(private fb: FormBuilder, private userService: UserService, private auth: AuthService, private router: Router, private toast: NgToastService) {}

	public model!: user_update;
	private usernameFromToken: string = this.auth.getUsernameFromToken();

	addMoneyForm!: FormGroup;

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
						street_nr: res.address.street_nr,
						balance: res.balance
					};
				},
				error: (err) => {
					this.toast.error({ detail: 'ERROR', summary: err.error.message, duration: 5000 });
				}
			});
		} else {
			this.router.navigate(['login']);
		}

		this.addMoneyForm = this.fb.group({
			balance: ['', Validators.required]
		});
	}

	addBalance() {
		if (this.addMoneyForm.valid) {
			var Balance = this.addMoneyForm.value.balance;
			var newBalance = { balance: +Balance };

			console.log(newBalance);
			this.userService.updateUserBalance(this.usernameFromToken, newBalance).subscribe({
				next: (res) => {
					this.toast.success({ detail: 'SUCESS', summary: 'You have updated your Balance', duration: 5000 });
				},
				error: (err) => {
					console.log(err);
					this.toast.error({ detail: 'ERROR', summary: err.error.message, duration: 5000 });
				}
			});
		} else {
			this.toast.warning({ detail: 'WARN', summary: 'This form is not valid!', duration: 5000 });
		}
	}
}
