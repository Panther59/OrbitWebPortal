import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService, CompanyService } from 'app/_services';
import { BaseListComponent } from 'app/organization/list/list.component';

@Component({
  selector: 'app-list',
  templateUrl: '../../organization/list/list.component.html',
  styleUrls: ['./list.component.scss', '../../organization/list/list.component.scss'],

})
export class ListComponent extends BaseListComponent {
  constructor(clientService: ClientService, public dialog: MatDialog) {
    super(clientService, dialog);
    this.type = 'client';
    this.displayName = 'Client';
  }
}
