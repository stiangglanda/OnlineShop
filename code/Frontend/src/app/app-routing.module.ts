import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './components/shop/shop.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { PaymentComponent } from './components/payment/payment.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'userprofile', component: UserprofileComponent},
  {path: 'transactions', component: TransactionsComponent},
  {path: 'payment', component: PaymentComponent},
  {path: 'header', component: HeaderComponent},
  {path: 'footer', component: FooterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
