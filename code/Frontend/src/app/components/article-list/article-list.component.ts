import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { article_list } from 'src/app/models/article_list';
import { ArticleService } from 'src/app/services/article.service';
import { CategorieService } from 'src/app/services/categorie.service';

@Component({
	selector: 'app-article-list',
	templateUrl: './article-list.component.html',
	styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
	constructor(private article: ArticleService, private categorie: CategorieService, private router: Router) {}

	public articleListModel!: article_list[];
	public categories!: string[];
	public articleCount!: number;

	ngOnInit(): void {
		this.article.getAllArticles().subscribe({
			next: (res) => {
				this.articleListModel = res.map((item: any) => ({
					article_id: item.id,
					name: item.name,
					description: item.description,
					price: item.price,
					categorie: item.categories.name,
					image_url: item.images.map((image: any) => image.url),
					seller_id: item.seller.id
				}));

				this.articleCount = this.articleListModel.length;
			},
			error: (err) => {
				console.log(err);
			}
		});
		this.categorie.getAllCategories().subscribe({
			next: (res) => {
				this.categories = res.map((item: any) => item.name);
			},
			error: (err) => {
				console.log(err);
			}
		});
	}

	navigateToItem(id: any, seller: any) {
		this.router.navigate(['/article-item/' + id + '/' + seller]);
	}
}
