import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrgType, Organization } from 'app/_models';
import { AddOrganizationDialog } from '../add-organization/add-organization.dialog';
import { OrganizationService } from 'app/_services';
import { getMessage } from 'app/global';
import { DialogMessageService } from 'app/app-dialogs/_services/dialog-messsage.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class BaseListComponent implements OnInit {
  public type?: OrgType;
  public displayName = '';

  loading = false;
  orgs: Organization[] = [];
  constructor(
    private organizationService: OrganizationService,
    private dialogMessageService: DialogMessageService,
    public dialog: MatDialog
  ) {}

  addNewOrg(): void {
    this.UpdateOrg();
  }

  UpdateOrg(org?: Organization) {
    const dialogRef = this.dialog.open(AddOrganizationDialog, {
      data: {
        type: this.type,
        displayName: this.displayName,
        service: this.organizationService,
        dialogMessageService: this.dialogMessageService,
        org,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  ViewOrg(org: Organization) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.organizationService.getAll().subscribe({
      next: orgs => {
        this.orgs = orgs.filter(x => x.type === this.type);
        this.loading = false;
      },
      error: async e => {
        this.loading = false;
        const message = getMessage(e);
        await this.dialogMessageService.showMessage('Register', message);
        console.error(e);
      },
      complete: () => console.info('complete'),
    });
  }
}
