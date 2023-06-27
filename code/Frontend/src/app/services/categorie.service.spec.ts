/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CategorieService } from './categorie.service';

describe('Service: Categorie', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategorieService]
    });
  });

  it('should ...', inject([CategorieService], (service: CategorieService) => {
    expect(service).toBeTruthy();
  }));
});
