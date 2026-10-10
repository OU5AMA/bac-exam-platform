import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { ShellComponent } from './shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: '9issemi · My class. Learn. Grow. Shine.',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
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
    path: '2-bac/exercices/unit-1/vocabulary/crossword',
    loadComponent: () => import('./exercises/crossword/crossword-page.component').then((m) => m.CrosswordPageComponent),
    title: 'Crossword · Unit 1 · 9issemi',
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard · 9issemi',
        loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      // future feature routes go here
    ],
  },
  { path: '**', redirectTo: 'sign-in' },
];
