import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CategorieService } from 'src/app/services/categorie.service';
import { create_article } from 'src/app/models/create_article';
import { ArticleService } from 'src/app/services/article.service';

@Component({
	selector: 'app-add-listing',
	templateUrl: './add-listing.component.html',
	styleUrls: ['./add-listing.component.css']
})
export class AddListingComponent implements OnInit {
	constructor(private fb: FormBuilder, private categorie: CategorieService, private auth: AuthService, private article: ArticleService, private router: Router) {}

	public categories!: string[];
	private createItem!: create_article;

	addItemForm!: FormGroup;

	ngOnInit(): void {
		this.categorie.getAllCategories().subscribe({
			next: (res) => {
				this.categories = res.map((item: any) => item.name);
			},
			error: (err) => {
				console.log(err);
			}
		});

		this.addItemForm = this.fb.group({
			name: ['', Validators.required],
			price: ['', Validators.required],
			img_url: ['', Validators.required],
			categories: ['', Validators.required],
			description: ['', Validators.required]
		});
	}

	createArticle() {
		if (this.addItemForm.valid) {
			let selectedCategories = this.addItemForm.value.categories;
			let image_urls = this.addItemForm.value.img_url;

			if (!Array.isArray(selectedCategories)) {
				selectedCategories = [selectedCategories];
			}

			if (!Array.isArray(image_urls)) {
				image_urls = [image_urls];
			}

			this.createItem = {
				name: this.addItemForm.value.name,
				description: this.addItemForm.value.description,
				price: this.addItemForm.value.price,
				seller_id: this.auth.getIdFromToken(),
				categories: selectedCategories,
				images: image_urls
			};

			this.article.createArticle(this.createItem).subscribe({
				next: (res) => {
					this.router.navigate(['/listings']);
				},
				error: (err) => {
					console.log(err);
				}
			});
		}
	}
}
