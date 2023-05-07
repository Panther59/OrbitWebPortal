import { Component, Inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Organization, Role, User, UserRole } from 'app/_models';
import { PermissionsService } from 'app/_services';
import { DialogMessageService } from 'app/app-dialogs';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.dialog.html',
  styleUrls: ['./edit-permission.dialog.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class EditPermissionDialog {
  permissionsService?: PermissionsService;
  isSubmitting = false;
  type = '';
  users: Array<User> = [];
  roles: Array<Role> = [];
  companies: Array<Organization> = [];
  clients: Array<Organization> = [];
  org: Organization = {};
  form: FormGroup = this.fb.group({});
  dialogMessageService?: DialogMessageService;

  constructor(
    private _ngZone: NgZone,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditPermissionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.permissionsService) {
      this.permissionsService = data.permissionsService;
    }

    if (data && data.dialogMessageService) {
      this.dialogMessageService = data.dialogMessageService;
    }

    if (data && data.users) {
      this.users = data.users;
    }

    if (data && data.roles) {
      this.roles = data.roles;
    }

    if (data && data.companies) {
      this.companies = data.companies;
    }

    if (data && data.clients) {
      this.clients = data.clients;
    }

    if (data && data.type) {
      this.type = data.type;
    }

    this.form = this.fb.group({
      user: ['', [Validators.required]],
      role: ['', [Validators.required]],
      client: ['', [Validators.required]],
      company: ['', [Validators.required]],
    });

    if (this.type !== 'add_company_user') {
      this.form.removeControl('company');
    }

    if (this.type !== 'add_client_user') {
      this.form.removeControl('client');
    }
  }

  getName(id?: number) {
    if (id) {
      const user = this.users.find(x => x.id === id);
      return `${user?.name} (${user?.email})`;
    }

    return '';
  }

  saveData() {
    if (this.form.valid) {
      this.isSubmitting = true;
      const req: UserRole = {};
      req.userID = this.form.value.user;
      req.roleID = this.form.value.role;

      if (this.type === 'add_client_user') {
        req.clientID = this.form.value.client;
      }

      if (this.type === 'add_company_user') {
        req.companyID = this.form.value.company;
      }

      if (this.permissionsService) {
        this.permissionsService.saveRole(req).subscribe(
          data => {
            this.dialogRef.close(true);
          },
          async err => {
            console.error(err);
            if (this.dialogMessageService) {
              await this.dialogMessageService.error('Permissions', err);
            }
            this.isSubmitting = false;
          }
        );
      }
    }
  }

  cancelSaving = () => {
    this.dialogRef.close(false);
  };
}
