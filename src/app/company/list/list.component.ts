import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from 'app/_services';
import { BaseListComponent } from 'app/organization/list/list.component';

@Component({
  selector: 'app-list',
  templateUrl: '../../organization/list/list.component.html',
  styleUrls: ['./list.component.scss', '../../organization/list/list.component.scss'],

})
export class ListComponent extends BaseListComponent {
  constructor(companyService: CompanyService, public dialog: MatDialog) {
    super(companyService, dialog);
    this.type = 'company';
    this.displayName = 'Company';
  }
}
