import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Organization, Role, UserRole } from 'app/_models';
import { ClientService, CompanyService, UsersService } from 'app/_services';
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
  companyUserRoles: UserRole[] = [];
  clientUserRoles: UserRole[] = [];
  roles: Role[] = [];
  clients: Organization[] = [];
  companies: Organization[] = [];
  rolesLoaded = false;
  clientsLoaded = false;
  companiesLoaded = false;
  constructor(
    private permissionsService: PermissionsService,
    private companyService: CompanyService,
    private clientService: ClientService,
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
        this.companyUserRoles = data.filter(x => x.clientID === undefined);
        this.companyUserRoles.forEach(x => {
          if (x.clientID === undefined && x.companyID === undefined) {
            x.client = 'All';
            x.company = 'All';
          } else if (x.clientID === undefined && x.companyID !== undefined) {
            x.client = 'All';
          }
        });

        this.clientUserRoles = data.filter(x => x.clientID !== undefined);

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
      if (!this.companiesLoaded) {
        const result = await this.companyService.getAll().toPromise();
        if (result) {
          this.companies = result;
          this.companiesLoaded = true;
        }
      }

      /// Ensure roles are only loaded once
      if (!this.clientsLoaded) {
        const result = await this.clientService.getAll().toPromise();
        if (result) {
          this.clients = result;
          this.clientsLoaded = true;
        }
      }
    } catch (error) {
      this.loading = false;
      const message = getMessage(error);
      await this.dialogMessageService.showMessage('Permissions', message);
      console.error(error);
    }
  }

  addNewUser(type: string, roles: Role[]) {
    this.usersService.getAll().subscribe({
      next: users => {
        const dialogRef = this.dialog.open(EditPermissionDialog, {
          data: {
            type,
            permissionsService: this.permissionsService,
            dialogMessageService: this.dialogMessageService,
            roles,
            companies: this.companies,
            clients: this.clients,
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
    const roles = this.roles.filter(x => !x.forClient);
    const type = 'add_super_user';
    this.addNewUser(type, roles);
  }
  addClientUser() {
    const roles = this.roles.filter(x => x.forClient);
    const type = 'add_client_user';
    this.addNewUser(type, roles);
  }

  addCompanyUser() {
    const roles = this.roles.filter(x => !x.forClient);
    const type = 'add_company_user';
    this.addNewUser(type, roles);
  }
}
