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
    path: '2-bac/unit/1/grammar',
    loadComponent: () => import('./pages/2bac/unit-1/grammar-lesson.component').then((m) => m.GrammarLessonComponent),
    title: 'Grammar · Unit 1 · 9issemi',
  },
  {
    path: '2-bac/unit/1/grammar/exercises',
    loadComponent: () => import('./pages/2bac/unit-1/grammar-exercises.component').then((m) => m.GrammarExercisesComponent),
    title: 'Grammar Exercises · 9issemi',
  },
  {
    path: '2-bac/unit/:unitId/:skill/lesson',
    loadComponent: () => import('./pages/2bac/skill-lesson.component').then((m) => m.SkillLessonComponent),
    title: 'Skill Lesson · 9issemi',
  },
  {
    path: '2-bac/unit/:unitId/:skill/exercises',
    loadComponent: () => import('./pages/2bac/exercise-type-chooser.component').then((m) => m.ExerciseTypeChooserComponent),
    title: 'Practice · 9issemi',
  },
  {
    path: '2-bac/unit/:unitId/vocabulary/exercises/crosswords',
    loadComponent: () => import('./exercises/crossword/crossword-list.component').then((m) => m.CrosswordListComponent),
    title: 'Crosswords · 9issemi',
  },
  {
    path: '2-bac/unit/:unitId/vocabulary/exercises/crosswords/puzzle',
    loadComponent: () => import('./exercises/crossword/crossword-page.component').then((m) => m.CrosswordPageComponent),
    title: 'Crossword · 9issemi',
  },
  {
    path: '2-bac/unit/:unitId/:skill/exercises/:type',
    loadComponent: () => import('./pages/2bac/exercise-type-page.component').then((m) => m.ExerciseTypePageComponent),
    title: 'Practice Activity · 9issemi',
  },
  {
    path: '2-bac/unit/1/function',
    loadComponent: () => import('./pages/2bac/function-lesson.component').then((m) => m.FunctionLessonComponent),
    title: 'Expressing Opinion · Unit 1 · 9issemi',
  },
  {
    path: '2-bac/unit/1/reading',
    loadComponent: () => import('./reading/reading-list.component').then((m) => m.ReadingListComponent),
    title: 'Reading · Unit 1 · 9issemi',
  },
  {
    path: '2-bac/unit/1/exam',
    data: { title: 'Exam Simulator', description: 'The Unit 1 exam simulator will be available here soon.' },
    loadComponent: () => import('./pages/2bac/unit-placeholder.component').then((m) => m.UnitPlaceholderComponent),
    title: 'Exam Simulator · Unit 1 · 9issemi',
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
    path: '2-bac/reading',
    loadComponent: () => import('./reading/reading-list.component').then((m) => m.ReadingListComponent),
    title: 'Reading Practice · 2 Bac · 9issemi',
  },
  {
    path: '2-bac/reading/:slug',
    loadComponent: () => import('./reading/reading-exam.component').then((m) => m.ReadingExamComponent),
    title: 'Reading Exam · 2 Bac · 9issemi',
  },
  {
    path: '2-bac/exercices/unit-1/vocabulary/crosswords',
    loadComponent: () => import('./exercises/crossword/crossword-list.component').then((m) => m.CrosswordListComponent),
    title: 'Crosswords · Unit 1 · 9issemi',
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
      {
        path: 'profile',
        title: 'Profile · 9issemi',
        loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'leaderboard',
        title: 'Class Leaderboard · 9issemi',
        loadComponent: () => import('./pages/leaderboard/leaderboard.component').then((m) => m.LeaderboardComponent),
      },
      // future feature routes go here
    ],
  },
  { path: '**', redirectTo: 'sign-in' },
];
