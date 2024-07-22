import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing-page/landing-page.component').then(
            (c) => c.LandingPageComponent
          ),
      },
      {
        path: 'user-page/:id',
        loadComponent: () =>
          import('./pages/user-page/user-page.component').then(
            (c) => c.UserPageComponent
          ),
      },
      {
        path: 'form-page',
        loadComponent: () =>
          import('./pages/form-page/form-page.component').then(
            (c) => c.FormPageComponent
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
