import { Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { CodesComponent } from './codes/codes.component';

const itemMasterRoutes: Routes = [
  {
    path: '',
    component: ViewerComponent,
  },
  {
    path: 'codes/:id',
    component: CodesComponent,
  },
];

export default itemMasterRoutes;
