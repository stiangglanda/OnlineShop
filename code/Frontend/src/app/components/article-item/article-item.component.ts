import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { article_list } from 'src/app/models/article_list';
import { create_transaction } from 'src/app/models/create_transaction';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-article-item',
	templateUrl: './article-item.component.html',
	styleUrls: ['./article-item.component.css']
})
export class ArticleItemComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private article: ArticleService,
		private router: Router,
		private toast: NgToastService,
		private user: UserService,
		private auth: AuthService,
		private transaction: TransactionService
	) {}

	public articleListModel!: article_list;
	private createTransModel!: create_transaction;

	public id: any;
	public seller_id: any;

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get('id');
		this.seller_id = this.route.snapshot.paramMap.get('sellerid');

		if (this.id == null || this.seller_id == null) {
			this.router.navigate(['/article-list']);
		} else {
			this.article.getArticlesID(this.id).subscribe({
				next: (res) => {
					this.articleListModel = {
						article_id: res.id,
						name: res.name,
						description: res.description,
						price: res.price,
						categorie: res.categories.map((categorie: any) => categorie.name),
						image_url: res.images.map((image: any) => image.url),
						seller_id: 1
					};
				},
				error: (err) => {
					this.toast.error({ detail: 'ERROR', summary: err, duration: 5000 });
				}
			});
		}
	}

	buyItem(balance: any, article_id: any) {
		if (this.auth.isLoggedIn()) {
			var balanceModel = { balance: -balance };

			this.user.updateUserBalance(this.auth.getUsernameFromToken(), balanceModel).subscribe({
				next: (res) => {
					var statusModel = { status: 0 };
					console.log(statusModel);
					this.article.changeArticleStatus(article_id, statusModel).subscribe({
						next: (res) => {
							this.createTransModel = {
								seller_id: parseInt(this.seller_id),
								buyer_id: this.auth.getIdFromToken(),
								article_id: parseInt(this.id)
							};
							this.transaction.createTransaction(this.createTransModel).subscribe({
								next: (res) => {
									this.toast.success({ detail: 'SUCCESS', summary: 'You bought this product', duration: 5000 });
									this.router.navigate(['/article-list']);
								},
								error: (err) => {
									this.toast.error({ detail: 'ERROR', summary: err.error.message, duration: 5000 });
								}
							});
						},
						error: (err) => {
							this.toast.error({ detail: 'ERROR', summary: err.error.message, duration: 5000 });
						}
					});
				},
				error: (err) => {
					this.toast.error({ detail: 'ERROR', summary: err.error.message, duration: 5000 });
				}
			});
		} else {
			this.router.navigate(['login']);
		}
	}
}
