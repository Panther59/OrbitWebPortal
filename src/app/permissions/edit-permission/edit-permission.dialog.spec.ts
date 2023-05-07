import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPermissionDialog } from './edit-permission.dialog';

describe('AddOrganizationDialog', () => {
  let component: EditPermissionDialog;
  let fixture: ComponentFixture<EditPermissionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPermissionDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPermissionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
