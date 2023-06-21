import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthService, public router: Router){}

  public isLogedIn!: boolean; 

  ngOnInit(): void {
    if(this.auth.isLoggedIn()){ this.isLogedIn = true; }
    else{ this.isLogedIn = false };
  }

  signIn()
  {
    this.router.navigate(['login']);
  }

  signOut()
  {
    this.isLogedIn = false;
    this.auth.signOut();
  }

}
