import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { PostPageComponent } from './pages/post-page/post-page.component';
import { FormEditPostComponent } from './pages/form-edit-post/form-edit-post.component';

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
        path: 'user-page/:userId/post-page/:postId',
        loadComponent: () =>
          import('./pages/post-page/post-page.component').then(
            (c) => c.PostPageComponent
          ),
      },
      {
        path: 'user-page/:userId/post-page/:postId/edit-post',
        loadComponent: () =>
          import('./pages/form-edit-post/form-edit-post.component').then(
            (c) => c.FormEditPostComponent
          ),
      },
      {
        path: 'user-page/:id/create-post',
        loadComponent: () =>
          import('./pages/form-creation-post/form-creation-post.component').then(
            (c) => c.FormCreationPostComponent
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
          import('./pages/form-creation-user/form-page.component').then(
            (c) => c.FormPageComponent
          ),
      },
      {
        path: 'edit-user/:id',
        loadComponent: () =>
          import('./pages/form-edit-user/form-edit-user.component').then(
            (c) => c.FormEditUserComponent
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
