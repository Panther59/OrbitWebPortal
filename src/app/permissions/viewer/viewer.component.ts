import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrgType, Organization, Role, RoleTypes, UserRole } from 'app/_models';
import { OrganizationService, UsersService } from 'app/_services';
import { PermissionsService } from 'app/_services/apis/permissions.service';
import { EditPermissionDialog } from '../edit-permission/edit-permission.dialog';
import { getMessage } from 'app/global';
import { DialogMessageService } from 'app/app-dialogs';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  loading = false;
  superUserRoles: UserRole[] = [];
  companyUserRoles: UserRole[] = [];
  clientUserRoles: UserRole[] = [];
  roles: Role[] = [];
  clients: Organization[] = [];
  companies: Organization[] = [];
  rolesLoaded = false;
  clientsLoaded = false;
  orgsLoaded = false;
  constructor(
    private permissionsService: PermissionsService,
    private organizationService: OrganizationService,
    private dialogMessageService: DialogMessageService,
    public dialog: MatDialog,
    private usersService: UsersService
  ) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.permissionsService.getAll().subscribe({
      next: async data => {
        await this.loadRoles();
        this.superUserRoles = data.filter(x => x.roleType === RoleTypes.Infra);
        this.companyUserRoles = data.filter(x => x.roleType === RoleTypes.Company);
        this.clientUserRoles = data.filter(x => x.roleType === RoleTypes.Client);

        this.loading = false;
      },
      error: async error => {
        this.loading = false;
        const message = getMessage(error);
        await this.dialogMessageService.showMessage('Permissions', message);
        console.error(error);
      },
    });
  }
  async loadRoles() {
    try {
      /// Ensure roles are only loaded once
      if (!this.rolesLoaded) {
        const result = await this.permissionsService.getAllRoles().toPromise();
        if (result) {
          this.roles = result;
          this.rolesLoaded = true;
        }
      }

      /// Ensure roles are only loaded once
      if (!this.orgsLoaded) {
        const result = await this.organizationService.getAll().toPromise();
        if (result) {
          this.companies = result.filter(x => x.type === OrgType.Company);
          this.clients = result.filter(x => x.type === OrgType.Client);
          this.orgsLoaded = true;
        }
      }
    } catch (error) {
      this.loading = false;
      const message = getMessage(error);
      await this.dialogMessageService.showMessage('Permissions', message);
      console.error(error);
    }
  }

  addNewUser(type: string, roles: Role[], organizations?: Organization[]) {
    this.usersService.getAll().subscribe({
      next: users => {
        const dialogRef = this.dialog.open(EditPermissionDialog, {
          data: {
            type,
            permissionsService: this.permissionsService,
            dialogMessageService: this.dialogMessageService,
            roles,
            organizations,
            users,
          },
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.loadData();
          }
        });
      },
      error: e => {},
    });
  }

  addSuperUser() {
    const roles = this.roles.filter(x => x.type === RoleTypes.Infra);
    const type = 'add_super_user';
    this.addNewUser(type, roles);
  }
  addClientUser() {
    const roles = this.roles.filter(x => x.type === RoleTypes.Client);
    const type = 'add_client_user';
    this.addNewUser(type, roles, this.clients);
  }

  addCompanyUser() {
    const roles = this.roles.filter(x => x.type === RoleTypes.Company);
    const type = 'add_company_user';
    this.addNewUser(type, roles, this.companies);
  }
}
