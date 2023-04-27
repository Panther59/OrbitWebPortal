import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Organization } from 'app/_models';
import { AddOrganizationDialog } from '../add-organization/add-organization.dialog';
import { OrganizationService } from 'app/_services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class BaseListComponent implements OnInit {
  public type = '';
  public displayName = '';

  loading = false;
  orgs: Organization[] = [];
  constructor(private organizationService: OrganizationService, public dialog: MatDialog) {}

  addNewOrg(): void {
    this.UpdateOrg();
  }

  UpdateOrg(org?: Organization) {
    const dialogRef = this.dialog.open(AddOrganizationDialog, {
      data: {
        type: this.type,
        displayName: this.displayName,
        service: this.organizationService,
        org,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
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
        this.orgs = orgs;
        this.loading = false;
      },
      error: e => {
        this.loading = false;
        console.error(e);
      },
      complete: () => console.info('complete'),
    });
  }
}
