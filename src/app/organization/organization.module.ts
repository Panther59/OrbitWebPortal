import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';
import { MaterialModule } from 'app/material.module';
import { AddOrganizationDialog } from './add-organization/add-organization.dialog';
import { BaseListComponent } from './list/list.component';

@NgModule({
  declarations: [BaseListComponent, AddOrganizationDialog],
  imports: [SharedModule],
  providers: [AddOrganizationDialog],
  exports: [BaseListComponent, AddOrganizationDialog]
})
export class OrganizationModule {}
