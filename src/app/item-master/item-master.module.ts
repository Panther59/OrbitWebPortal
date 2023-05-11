import { NgModule } from '@angular/core';
import { ViewerComponent } from './viewer/viewer.component';
import { SharedModule } from '@shared';
import itemMasterRoutes from './item-master.routes';
import { RouterModule } from '@angular/router';
import { EditSegmentComponent } from './edit-segment/edit-segment.component';

@NgModule({
  declarations: [
    ViewerComponent,
    EditSegmentComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(itemMasterRoutes),
  ]
})
export class ItemMasterModule { }
