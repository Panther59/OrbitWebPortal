import { NgModule } from '@angular/core';
import { ListComponent } from './list/list.component';
import { CompanyRoutingModule } from './company.routing.module';
import { SharedModule } from '@shared';
import { OrganizationModule } from 'app/organization/organization.module';

@NgModule({
  declarations: [ListComponent],
  imports: [SharedModule, CompanyRoutingModule, OrganizationModule],
})
export class CompanyModule {}
