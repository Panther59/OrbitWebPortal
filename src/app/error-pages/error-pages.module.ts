import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { Error403Component } from './403.component';
import { Error404Component } from './404.component';
import { Error500Component } from './500.component';
import { ErrorPagesRoutingModule } from './error-pages.routing.module';

const COMPONENTS: any[] = [
  Error403Component,
  Error404Component,
  Error500Component,
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, ErrorPagesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
})
export class ErrorPagesModule {}
