import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShopComponent } from './components/shop/shop.component';
import { LoginComponent } from './components/login/login.component';
import { ShopListContentComponent } from './components/content/shop-list-content/shop-list-content.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { PaymentComponent } from './components/payment/payment.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ListingsComponent } from './components/listings/listings.component';
import { AgbComponent } from './components/agb/agb.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { ArticleListComponent } from './components/article-list/article-list.component';
<<<<<<< HEAD
import { TestComponent } from './components/test/test.component';
import { ArticleItemComponent } from './components/article-item/article-item.component';

@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    LoginComponent,
    ShopListContentComponent,
    SignupComponent,
    UserprofileComponent,
    TransactionsComponent,
    PaymentComponent,
    HeaderComponent,
    FooterComponent,
    ListingsComponent,
    AgbComponent,
    DatenschutzComponent,
    ImpressumComponent,
    ArticleListComponent,
    TestComponent,
    ArticleItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
=======

@NgModule({
	declarations: [
		AppComponent,
		ShopComponent,
		LoginComponent,
		ShopListContentComponent,
		SignupComponent,
		UserprofileComponent,
		TransactionsComponent,
		PaymentComponent,
		HeaderComponent,
		FooterComponent,
		ListingsComponent,
		AgbComponent,
		DatenschutzComponent,
		ImpressumComponent,
		ArticleListComponent
	],
	imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule],
	providers: [],
	bootstrap: [AppComponent]
>>>>>>> 5d8d0bbd50cb3552389bf93d7ac2c8c9cbb6ee2c
})
export class AppModule {}
