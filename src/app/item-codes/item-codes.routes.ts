import { Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { CodesComponent } from './codes/codes.component';

const itemCodesRoutes: Routes = [
  {
    path: '',
    component: ViewerComponent,
  },
  {
    path: ':id',
    component: CodesComponent,
  },
];

export default itemCodesRoutes;