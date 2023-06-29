import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './components/shop/shop.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { ListingsComponent } from './components/listings/listings.component';
import { AddListingComponent } from './components/add-listing/add-listing.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { PaymentComponent } from './components/payment/payment.component';
import { AgbComponent } from './components/agb/agb.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { ArticleItemComponent } from './components/article-item/article-item.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthGuard } from './guard/auth.guard';
import { ChangeArticleComponent } from './components/change-article/change-article.component';

const routes: Routes = [
  {path: '', redirectTo: 'article-list', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'userprofile', component: UserprofileComponent, canActivate: [AuthGuard]},
  {path: 'listings', component: ListingsComponent, canActivate: [AuthGuard]},
  {path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard]},
  {path: 'payment', component: PaymentComponent , canActivate: [AuthGuard]},
  {path: 'agb', component: AgbComponent},
  {path: 'datenschutz', component: DatenschutzComponent},
  {path: 'impressum', component: ImpressumComponent},
  {path: 'article-list', component: ArticleListComponent},
  {path: 'article-item/:id', component: ArticleItemComponent},
  {path: 'addlisting', component: AddListingComponent, canActivate: [AuthGuard]},
  {path: 'change-article/:id', component: ChangeArticleComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
