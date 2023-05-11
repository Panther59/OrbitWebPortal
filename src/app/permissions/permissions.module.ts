import { NgModule } from '@angular/core';
import { ViewerComponent } from './viewer/viewer.component';
import { SharedModule } from '@shared';
import { PermissionsRoutingModule } from './permissions.routing.module';
import { DxDataGridModule } from 'devextreme-angular';
import { EditPermissionDialog } from './edit-permission/edit-permission.dialog';

@NgModule({
  declarations: [ViewerComponent, EditPermissionDialog],
  imports: [SharedModule, PermissionsRoutingModule, DxDataGridModule],
  providers: [EditPermissionDialog],
})
export class PermissionsModule {}
