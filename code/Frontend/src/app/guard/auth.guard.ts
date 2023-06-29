import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  
  constructor(private router: Router, private auth: AuthService){}

  canActivate(): boolean 
  {
    if(this.auth.isLoggedIn())
      return true;
    else{
      alert('Please Login First');
      this.router.navigate( ['login'] );
      return false;
    }
  }
  
}
