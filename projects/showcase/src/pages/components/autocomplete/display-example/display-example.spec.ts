import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayExample } from './display-example';

describe('DisplayExample', () => {
  let component: DisplayExample;
  let fixture: ComponentFixture<DisplayExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
