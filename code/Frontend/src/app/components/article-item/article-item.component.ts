import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { article_list } from 'src/app/models/article_list';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.css']
})
export class ArticleItemComponent implements OnInit{

  constructor(private route : ActivatedRoute, private article : ArticleService, private router : Router){}

  public articleListModel! : article_list;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if(id == null)
    {
      this.router.navigate(['article-item']);
    }
    else
    {
      this.article.getArticlesID(id).subscribe({
        next: (res => {
          this.articleListModel = {
            article_id: res.id,
            name: res.name,
            description: res.description,
            price: res.price,
            categorie: res.categories.map((categorie: any) => categorie.name),
            image_url: res.images.map((image: any) => image.url)
          }
          console.log(this.articleListModel);
        }),
        error: (err => {
          console.log(err);
        })
      });
    }
  }

}
