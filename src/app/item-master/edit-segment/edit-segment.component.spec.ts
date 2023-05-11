import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSegmentComponent } from './edit-segment.component';

describe('EditSegmentComponent', () => {
  let component: EditSegmentComponent;
  let fixture: ComponentFixture<EditSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSegmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
