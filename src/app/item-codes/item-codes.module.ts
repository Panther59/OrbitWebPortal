import { NgModule } from '@angular/core';
import { ViewerComponent } from './viewer/viewer.component';
import { SharedModule } from '@shared';
import itemCodesRoutes from './item-codes.routes';
import { RouterModule } from '@angular/router';
import { EditSegmentComponent } from './edit-segment/edit-segment.component';
import { CodesComponent } from './codes/codes.component';
import { DxButtonModule, DxDataGridModule } from 'devextreme-angular';
import { CodeSelectorComponent } from './code-selector/code-selector.component';

@NgModule({
  declarations: [
    CodeSelectorComponent,
    ViewerComponent,
    EditSegmentComponent,
    CodesComponent
  ],
  imports: [
    SharedModule,
    DxDataGridModule,
    DxButtonModule,
    RouterModule.forChild(itemCodesRoutes),
  ]
})
export class ItemCodesModule { }
