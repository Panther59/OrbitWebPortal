import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './app-layout/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './app-layout/auth-layout/auth-layout.component';
import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'company',
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
      },
      {
        path: 'clients',
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'permissions',
        loadChildren: () => import('./permissions/permissions.module').then(m => m.PermissionsModule),
      },
      {
        path: 'item-codes',
        loadChildren: () => import('./item-codes/item-codes.module').then(m => m.ItemCodesModule),
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
      },
      {
        path: 'error',
        loadChildren: () =>
          import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule),
      },
    ],
  },
];

export default appRoutes;
