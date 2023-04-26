import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { AdminLayoutComponent } from './app-layout/admin-layout/admin-layout.component';
import { AuthGuard } from '@core';
import { AuthLayoutComponent } from './app-layout/auth-layout/auth-layout.component';

const routes: Routes = [
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
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      enableTracing: true
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
