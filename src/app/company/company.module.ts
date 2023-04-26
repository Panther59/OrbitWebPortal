import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { CompanyRoutingModule } from './company.routing.module';
import { SharedModule } from '@shared';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule
  ]
})
export class CompanyModule { }
