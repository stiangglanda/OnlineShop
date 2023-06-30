import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { user_login } from 'src/app/models/user_login';
import { user_signup } from 'src/app/models/user_signup';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	loginForm!: FormGroup;
	registerForm!: FormGroup;
	signUpModel!: user_signup;

	constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private toast: NgToastService) {}

	ngOnInit(): void {
		this.loginForm = this.fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});
		this.registerForm = this.fb.group({
			firstname: ['', Validators.required],
			lastname: ['', Validators.required],
			username: ['', Validators.required],
			email: ['', Validators.required],
			password: ['', Validators.required],
			password_rep: ['', Validators.required]
		});
	}

	onLogin() {
		if (this.loginForm.valid) {
			const model: user_login = this.create_user_Model();
			this.auth.login(model).subscribe({
				next: (res) => {
					this.loginForm.reset();
					this.auth.storeToken(res.token);
					this.router.navigate(['article-list']).then(() => {
						window.location.reload();
					});
				},
				error: (err) => {
					this.toast.error({ detail: 'ERROR', summary: err.error.message, duration: 5000 });
				}
			});
		} else {
			ValidateForm.validateAllFormFields(this.loginForm);
			this.toast.warning({ detail: 'WARN', summary: 'This form is not valid!', duration: 5000 });
		}
	}

	create_user_Model(): user_login {
		const model: user_login = {
			emailOrUsername: this.loginForm.value.email,
			password: this.loginForm.value.password
		};

		return model;
	}

	signIn() {
		if (this.registerForm.valid) {
			if (this.registerForm.value.password === this.registerForm.value.password_rep) {
				this.signUpModel = {
					username: this.registerForm.value.username,
					firstname: this.registerForm.value.firstname,
					lastname: this.registerForm.value.lastname,
					email: this.registerForm.value.email,
					password: this.registerForm.value.password,
					city: 0,
					plz: 0,
					street: 0,
					street_nr: 0
				};

				this.auth.signUp(this.signUpModel).subscribe({
					next: (res) => {
						this.registerForm.reset();
						// alert('You have registered your account. Please log in.');
						this.toast.success({ detail: 'Success', summary: "You have registered your account!", duration: 5000 });
						this.router.navigate(['login']);
					},
					error: (err) => {
						console.log(err);
					}
				});
			} else {
				this.toast.error({ detail: 'ERROR', summary: "Password doesn't match!", duration: 5000 });
			}
		} else {
			this.toast.warning({ detail: 'WARN', summary: 'This form is not valid!', duration: 5000 });
		}
	}
}
