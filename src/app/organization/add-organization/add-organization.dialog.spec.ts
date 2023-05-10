import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrganizationDialog } from './add-organization.dialog';

describe('AddOrganizationDialog', () => {
  let component: AddOrganizationDialog;
  let fixture: ComponentFixture<AddOrganizationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrganizationDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrganizationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
