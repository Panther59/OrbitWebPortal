import { NgModule } from '@angular/core';
import { ViewerComponent } from './viewer/viewer.component';
import { SharedModule } from '@shared';
import itemMasterRoutes from './item-master.routes';
import { RouterModule } from '@angular/router';
import { EditSegmentComponent } from './edit-segment/edit-segment.component';
import { CodesComponent } from './codes/codes.component';
import { DxButtonModule, DxDataGridModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    ViewerComponent,
    EditSegmentComponent,
    CodesComponent
  ],
  imports: [
    SharedModule,
    DxDataGridModule,
    DxButtonModule,
    RouterModule.forChild(itemMasterRoutes),
  ]
})
export class ItemMasterModule { }
