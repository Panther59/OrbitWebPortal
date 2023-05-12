import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodesComponent } from './codes.component';

describe('CodesComponent', () => {
  let component: CodesComponent;
  let fixture: ComponentFixture<CodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
