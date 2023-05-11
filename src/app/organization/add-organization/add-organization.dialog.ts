import { Component, Inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrgType, Organization } from 'app/_models';
import { OrganizationService } from 'app/_services';
import { DialogMessageService } from 'app/app-dialogs';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.dialog.html',
  styleUrls: ['./add-organization.dialog.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AddOrganizationDialog {
  isSubmitting = false;
  type?: OrgType;
  org: Organization = {};
  form: FormGroup = this.fb.group({});
  organizationService!: OrganizationService;
  dialogMessageService?: DialogMessageService;
  constructor(
    private _ngZone: NgZone,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddOrganizationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      if (data.org) {
        this.org = data.org;
      }

      if (data.dialogMessageService) {
        this.dialogMessageService = data.dialogMessageService;
      }
      if (data.type) {
        this.type = data.type;
      }
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
      req.type = this.type;

      this.organizationService.addUpdate(req).subscribe({
        next: org => {
          this.dialogRef.close(true);
        },
        error: e => {
          this.isSubmitting = false;
          if (this.dialogMessageService) {
            this.dialogMessageService.error('Save Segment', e);
          } else {
            console.error(e);
          }
        },
      });
    }
  }
  cancelSaving = () => {
    this.dialogRef.close(false);
  };
}
