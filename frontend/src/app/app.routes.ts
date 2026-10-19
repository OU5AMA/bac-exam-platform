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
    path: '2-bac',
    loadComponent: () => import('./pages/2bac/grade-hub.component').then((m) => m.GradeHubComponent),
    title: '2 Baccalaureate · 9issemi',
  },
  {
    path: '2-bac/unit/:unitId',
    loadComponent: () => import('./pages/2bac/unit-hub.component').then((m) => m.UnitHubComponent),
    title: 'Unit · 2 Bac · 9issemi',
  },
  {
    path: '2-bac/national-exam',
    loadComponent: () => import('./pages/2bac/national-exam.component').then((m) => m.NationalExamComponent),
    title: 'National Exam Prep · 9issemi',
  },
  {
    path: '2-bac/exercices/unit-1/vocabulary/crosswords',
    loadComponent: () => import('./exercises/crossword/crossword-page.component').then((m) => m.CrosswordPageComponent),
    title: 'Crossword · Unit 1 · 9issemi',
  },
  {
    path: '2-bac/exercices/unit-1/vocabulary/crossword',
    redirectTo: '2-bac/exercices/unit-1/vocabulary/crosswords',
    pathMatch: 'full',
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
