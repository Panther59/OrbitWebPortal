import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ClientRoutingModule } from './client.routing.module';
import { ListComponent } from './list/list.component';
import { OrganizationModule } from 'app/organization/organization.module';

@NgModule({
  declarations: [ListComponent],
  imports: [SharedModule, ClientRoutingModule, OrganizationModule],
  providers: [],
})
export class ClientModule {}
