import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionPanel } from './expansion-panel';

describe('ExpansionPanel', () => {
  let component: ExpansionPanel;
  let fixture: ComponentFixture<ExpansionPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpansionPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpansionPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
