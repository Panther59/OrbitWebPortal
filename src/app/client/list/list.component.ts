import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService, CompanyService } from 'app/_services';
import { DialogMessageService } from 'app/app-dialogs';
import { BaseListComponent } from 'app/organization/list/list.component';

@Component({
  selector: 'app-list',
  templateUrl: '../../organization/list/list.component.html',
  styleUrls: ['./list.component.scss', '../../organization/list/list.component.scss'],

})
export class ListComponent extends BaseListComponent {
  constructor(
    clientService: ClientService,
    dialogMessageService: DialogMessageService,
    public dialog: MatDialog) {
    super(clientService, dialogMessageService, dialog);
    this.type = 'client';
    this.displayName = 'Client';
  }
}
