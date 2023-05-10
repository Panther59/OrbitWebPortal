import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth.routing.module';
import { AppDialogsModule } from 'app/app-dialogs/app-dialog.module';

const COMPONENTS: any[] = [LoginComponent, RegisterComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, AuthRoutingModule, AppDialogsModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
})
export class AuthModule {}
