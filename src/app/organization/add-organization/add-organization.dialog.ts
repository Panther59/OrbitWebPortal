import { Component, Inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Organization } from 'app/_models';
import { CompanyService, OrganizationService } from 'app/_services';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.dialog.html',
  styleUrls: ['./add-organization.dialog.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AddOrganizationDialog {
  isSubmitting = false;
  org: Organization = {};
  form: FormGroup = this.fb.group({});
  organizationService!: OrganizationService;
  constructor(
    private _ngZone: NgZone,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddOrganizationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.org) {
      this.org = data.org;
    }

    this.organizationService = data.service as OrganizationService;

    this.form = this.fb.group({
      id: [this.org?.id],
      name: [this.org?.name, [Validators.required]],
      code: [this.org?.code, [Validators.required]],
      addressLine1: [this.org?.addressLine1, [Validators.required]],
      addressLine2: [this.org?.addressLine2, [Validators.required]],
      zipCode: [this.org?.zipCode, [Validators.required]],
      city: [this.org?.city, [Validators.required]],
      email: [this.org?.email, [Validators.required, Validators.email]],
      isActive: [this.org?.isActive ?? true],
    });
  }

  saveData() {
    if (this.form.valid) {
      this.isSubmitting = true;
      const req: Organization = {};
      req.id = this.form.value.id;
      req.addressLine1 = this.form.value.addressLine1;
      req.addressLine2 = this.form.value.addressLine2;
      req.city = this.form.value.city;
      req.code = this.form.value.code;
      req.country = this.form.value.country;
      req.email = this.form.value.email;
      req.isActive = this.form.value.isActive;
      req.name = this.form.value.name;
      req.zipCode = this.form.value.zipCode;

      this.organizationService.addUpdate(req).subscribe({
        next: org => {
          this.dialogRef.close();
        },
        error: e => {
          this.isSubmitting = false;
          console.error(e);
        },
        complete: () => {
          console.info('complete');
        },
      });
    }
  }
  cancelSaving = () => {
    this.dialogRef.close();
  };
}
