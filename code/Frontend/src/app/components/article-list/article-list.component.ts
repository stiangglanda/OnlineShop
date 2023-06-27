import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { article_list } from 'src/app/models/article_list';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  constructor(private article : ArticleService){}

  public articleListModel! : article_list[];

  ngOnInit(): void {
    this.article.getAllArticles().subscribe({
      next: (res => {
        this.articleListModel = res.map((item: any) => ({
          article_id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          categorie: item.categories.name,
          image_url: item.images.map((image: any) => image.url)
        }));
        console.log(this.articleListModel);
      }),
      error: (err => {
        console.log(err);
      })
    });
  }
}
