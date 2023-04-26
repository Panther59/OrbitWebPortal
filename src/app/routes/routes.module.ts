import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from '../auth/login/login.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';

const COMPONENTS: any[] = [
  Error403Component,
  Error404Component,
  Error500Component,
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
})
export class RoutesModule {}
