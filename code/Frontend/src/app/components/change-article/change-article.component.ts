import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { change_article } from 'src/app/models/change_article';
import { ArticleService } from 'src/app/services/article.service';
import { CategorieService } from 'src/app/services/categorie.service';

@Component({
  selector: 'app-change-article',
  templateUrl: './change-article.component.html',
  styleUrls: ['./change-article.component.css']
})
export class ChangeArticleComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private categorie: CategorieService,
    private articles: ArticleService
  ) { }

  changeItemForm!: FormGroup;
  public id: any;
  public categories!: string[];
  public imgUrl!: string;
  public article!: change_article;
  public change_Article!: change_article;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.categorie.getAllCategories().subscribe(
      {
        next: (res) =>
        {
          this.categories = res.map((item: any) => item.name);
        },
        error: (err) =>
        {
          console.log(err);
        }
      }
    );

    this.articles.getArticlesID(this.id).subscribe(
      {
        next: (res) => 
        {
          this.article =
          {
            name: res.name,
            description: res.description,
            price: res.price
          };
          this.imgUrl = res.images.map((item: any) => item.url);
        },
        error: (err) => 
        {
          console.log(err);
        }
      }
    );

    this.changeItemForm = this.fb.group(
      {
        name: ['', Validators.required],
        price: ['', Validators.required],
        description: ['', Validators.required]
      }
    );
  }

  changeArticle()
  {
    if(this.changeItemForm.valid)
    {
      this.change_Article = 
      {
        name: this.changeItemForm.value.name,
        description: this.changeItemForm.value.description,
        price: this.changeItemForm.value.price
      };
      
      this.articles.changeArticle(this.id, this.change_Article).subscribe(
        {
          next: (res) => 
          {
            console.log("Article Changed");
          },
          error: (err) =>
          {
            console.log(err);
          }
        }
      );

    }
    
  }


}
