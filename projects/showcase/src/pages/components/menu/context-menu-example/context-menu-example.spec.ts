import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuExample } from './context-menu-example';

describe('ContextMenuExample', () => {
  let component: ContextMenuExample;
  let fixture: ComponentFixture<ContextMenuExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextMenuExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextMenuExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
