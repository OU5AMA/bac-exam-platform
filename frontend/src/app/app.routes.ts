import { Routes, UrlMatcher, UrlSegment } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { ShellComponent } from './shell/shell.component';

const legacyCrosswordMatcher = (segments: UrlSegment[], page: 'crosswords' | 'crossword') => {
  const unitId = segments[2]?.path.match(/^unit-(\d+)$/)?.[1];
  if (
    segments.length !== 5 || segments[0].path !== '2-bac' || segments[1].path !== 'exercices' ||
    !unitId || segments[3].path !== 'vocabulary' || segments[4].path !== page
  ) return null;
  return { consumed: segments, posParams: { unitId: new UrlSegment(unitId, {}) } };
};

const legacyCrosswordListMatcher: UrlMatcher = (segments) => legacyCrosswordMatcher(segments, 'crosswords');
const legacyCrosswordPuzzleMatcher: UrlMatcher = (segments) => legacyCrosswordMatcher(segments, 'crossword');

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
    path: '2-bac/unit/:unitId/:skill/lesson',
    loadComponent: () => import('./pages/2bac/skill-lesson.component').then((m) => m.SkillLessonComponent),
    title: 'Skill Lesson · 9issemi',
  },
  {
    path: '2-bac/unit/:unitId/:skill/exercises',
    loadComponent: () => import('./pages/2bac/exercise-type-chooser.component').then((m) => m.ExerciseTypeChooserComponent),
    title: 'Choose an Exercise · 9issemi',
  },
  {
    path: '2-bac/unit/:unitId/vocabulary/exercises/crosswords/puzzle',
    loadComponent: () => import('./exercises/crossword/crossword-page.component').then((m) => m.CrosswordPageComponent),
    title: 'Crossword · 9issemi',
  },
  {
    path: '2-bac/unit/:unitId/vocabulary/exercises/crosswords',
    loadComponent: () => import('./exercises/crossword/crossword-list.component').then((m) => m.CrosswordListComponent),
    title: 'Crosswords · 9issemi',
  },
  {
    path: '2-bac/unit/:unitId/:skill/exercises/:type',
    loadComponent: () => import('./pages/2bac/exercise-type-page.component').then((m) => m.ExerciseTypePageComponent),
    title: 'Exercise · 9issemi',
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
  { matcher: legacyCrosswordListMatcher, redirectTo: '/2-bac/unit/:unitId/vocabulary/exercises/crosswords' },
  { matcher: legacyCrosswordPuzzleMatcher, redirectTo: '/2-bac/unit/:unitId/vocabulary/exercises/crosswords/puzzle' },
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
        path: 'leaderboard',
        title: 'Class Leaderboard · 9issemi',
        loadComponent: () => import('./pages/leaderboard/leaderboard.component').then((m) => m.LeaderboardComponent),
      },
      // future feature routes go here
    ],
  },
  { path: '**', redirectTo: 'sign-in' },
];
