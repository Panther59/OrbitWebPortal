import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialog, MessageDialog } from '../app-dialogs';
import { DialogMessageService } from './_services/dialog-messsage.service';

const MODULES: any[] = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  MaterialModule,
  TranslateModule,
];
const COMPONENTS: any[] = [];
const DIALOGS: any[] = [MessageDialog, ConfirmDialog];
const SERVICES: any[] = [DialogMessageService];

@NgModule({
  imports: [...MODULES],
  declarations: [
    ...COMPONENTS,
    ...DIALOGS,
  ],
  providers: [...DIALOGS, ...SERVICES],
})
export class AppDialogsModule {}
