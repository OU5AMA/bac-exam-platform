import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sign-in',
    title: 'Sign in · 9issemi',
    loadComponent: () => import('./auth/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: 'sign-up',
    title: 'Create your account · 9issemi',
    loadComponent: () => import('./auth/sign-up.component').then((m) => m.SignUpComponent),
  },
  {
    path: 'dashboard', // throwaway, replace with the real app shell
    title: '9issemi',
    loadComponent: () =>
      import('./dashboard-placeholder.component').then((m) => m.DashboardPlaceholderComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
  { path: '**', redirectTo: 'sign-in' },
];