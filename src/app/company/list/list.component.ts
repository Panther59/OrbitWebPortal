import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Organization } from 'app/_models';
import { CompanyService } from 'app/_services';
import { AddCompanyDialog } from '../add-company/add-company.dialog';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  companies: Organization[] = [];
  constructor(private companyService: CompanyService, public dialog: MatDialog) {}

  addNewCompany(): void {
    const dialogRef = this.dialog.open(AddCompanyDialog, {
      data: {},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  UpdateOrg(org: Organization) {
    const dialogRef = this.dialog.open(AddCompanyDialog, {
      data: { org },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }

  DeleteOrg(org: Organization) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.companyService.getAll().subscribe({
      next: orgs => (this.companies = orgs),
      error: e => console.error(e),
      complete: () => console.info('complete'),
    });
  }
}
