import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopListContentComponent } from './shop-list-content.component';

describe('ShopListContentComponent', () => {
	let component: ShopListContentComponent;
	let fixture: ComponentFixture<ShopListContentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ShopListContentComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ShopListContentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
