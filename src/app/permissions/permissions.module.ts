import { NgModule } from '@angular/core';
import { ViewerComponent } from './viewer/viewer.component';
import { SharedModule } from '@shared';
import { PermissionsRoutingModule } from './permissions.routing.module';
import { DxDataGridModule } from 'devextreme-angular';
@NgModule({
  declarations: [ViewerComponent],
  imports: [SharedModule, PermissionsRoutingModule, DxDataGridModule],
})
export class PermissionsModule {}
