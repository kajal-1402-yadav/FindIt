import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimItem } from './claim-item';

describe('ClaimItem', () => {
  let component: ClaimItem;
  let fixture: ComponentFixture<ClaimItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClaimItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
