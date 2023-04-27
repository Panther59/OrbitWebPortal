import { NgModule } from '@angular/core';
import { ViewerComponent } from './viewer/viewer.component';
import { SharedModule } from '@shared';
import { PermissionsRoutingModule } from './permissions.routing.module';

@NgModule({
  declarations: [ViewerComponent],
  imports: [SharedModule, PermissionsRoutingModule],
})
export class PermissionsModule {}
