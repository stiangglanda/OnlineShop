import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { user_update } from 'src/app/models/user_update';
import { NgToastService } from 'ng-angular-popup';
import { TransactionService } from 'src/app/services/transaction.service';
import { transaction_list } from 'src/app/models/transaction_list';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private transaction: TransactionService,
  ){}

  public model!: user_update;
  public transModel!: transaction_list[];
  public buyTransModel!: transaction_list[];
  private usernameFromToken: string = this.auth.getUsernameFromToken();
  private counter: number = 1; 
  private buycounter: number = 1; 

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
            street_nr: res.address.street_nr,
            balance: res.balance
          };
        }),
        error: (err) => 
        { 
          this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000});
        }
      });
      this.transaction.getSellerTransaction(this.usernameFromToken).subscribe(
        {
          next: (res) => 
          {
            this.transModel = res.map((item: any) => 
              ({
                nr:  this.counter++,
                name: item.article.name,
                buyer: item.buyer.username,
                date: item.created,
                price: item.article.price
              })
            );
          },
          error: (err) =>
          {
            this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000});
          }
        }
      );

      this.transaction.getBuyerTransaction(this.usernameFromToken).subscribe(
        {
          next: (res) => 
          {
            this.buyTransModel = res.map((item: any) => 
              ({
                nr: this.buycounter++,
                name: item.article.name,
                buyer: item.article.seller.username,
                date: item.created,
                price: item.article.price
              })
            );
          },
          error: (err) =>
          {
            this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000});
          }
        }
      );

    }
    else
    {
      this.router.navigate( ['login'] );
    }
  }


}
