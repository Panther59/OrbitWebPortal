import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrgType } from 'app/_models';
import { OrganizationService } from 'app/_services';
import { DialogMessageService } from 'app/app-dialogs';
import { BaseListComponent } from 'app/organization/list/list.component';

@Component({
  selector: 'app-list',
  templateUrl: '../../organization/list/list.component.html',
  styleUrls: ['./list.component.scss', '../../organization/list/list.component.scss'],
})
export class ListComponent extends BaseListComponent {
  constructor(
    organizationService: OrganizationService,
    dialogMessageService: DialogMessageService,
    public dialog: MatDialog
  ) {
    super(organizationService, dialogMessageService, dialog);
    this.displayName = 'Client';
    this.type = OrgType.Client;
  }
}
