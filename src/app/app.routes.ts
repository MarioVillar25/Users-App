import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { PostPageComponent } from './pages/post-page/post-page.component';

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
        path: 'posts-list',
        loadComponent: () =>
          import('./pages/posts-list/posts-page.component').then(
            (c) => c.PostsPageComponent
          ),
      },
      {
        path: 'post-page/:id',
        loadComponent: () =>
          import('./pages/post-page/post-page.component').then(
            (c) => c.PostPageComponent
          ),
      },
      {
        path: 'users-list',
        loadComponent: () =>
          import('./pages/users-list/users-list.component').then(
            (c) => c.UsersListComponent
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
        path: 'create-user',
        loadComponent: () =>
          import('./pages/create-user/form-page.component').then(
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
