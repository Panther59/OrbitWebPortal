import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { CompanyRoutingModule } from './company.routing.module';
import { SharedModule } from '@shared';
import { MaterialModule } from 'app/material.module';
import { AddCompanyDialog } from './add-company/add-company.dialog';

@NgModule({
  declarations: [ListComponent, AddCompanyDialog],
  imports: [SharedModule, CompanyRoutingModule],
  providers: [AddCompanyDialog],
})
export class CompanyModule {}
