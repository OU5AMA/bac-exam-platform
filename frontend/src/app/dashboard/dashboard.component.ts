import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { finalize } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { randomLoadingMessage } from '../shared/loading-messages';
import { DailyChallengeComponent } from './daily-challenge.component';
import { ClassPanelComponent } from '../classes/class-panel.component';

type TimeRange = 'week' | 'month' | 'all';
type MasterySkill = 'Vocabulary' | 'Grammar' | 'Reading' | 'Function' | 'Writing';
type TimelineDataset = { label: string; data: number[]; color: string };
type TimelineRangeData = { labels: string[]; datasets: TimelineDataset[] };
type BadgeDisplay = { code: string; title: string; description: string; icon: string; background: string; foreground: string };
type PointsSummary = { individualPoints: number; className: string | null; classPoints: number | null };

const TIMELINE_SERIES = [
  { label: 'Reading Comprehension', color: '#16A34A' },
  { label: 'Vocabulary', color: '#7C3AED' },
  { label: 'Grammar', color: '#F97316' },
  { label: 'Function', color: '#2563EB' },
  { label: 'Writing', color: '#DC2626' },
];

function createTimelineData(labels: string[], values: number[][]): TimelineRangeData {
  return {
    labels,
    datasets: TIMELINE_SERIES.map((series, index) => ({ ...series, data: values[index] })),
  };
}

const BADGE_CATALOG: Record<string, BadgeDisplay> = {
  GRAMMAR_GURU: { code: 'GRAMMAR_GURU', title: 'Grammar Guru', description: 'Scored 100% on a grammar exercise.', icon: '✓', background: '#E8F0FE', foreground: '#174EA6' },
  VOCAB_MASTER: { code: 'VOCAB_MASTER', title: 'Vocab Master', description: 'Completed three vocabulary crosswords.', icon: 'Aa', background: '#E6F4F1', foreground: '#0B6255' },
  OPINION_EXPERT: { code: 'OPINION_EXPERT', title: 'Opinion Expert', description: 'Earned a perfect score in Function practice.', icon: '✦', background: '#FFF0D5', foreground: '#8A4B08' },
  DAILY_CHALLENGE: { code: 'DAILY_CHALLENGE', title: 'Daily Challenger', description: 'Beat the clock with a perfect score in a daily challenge.', icon: '⏱', background: '#FFF0D5', foreground: '#71420C' },
  READING_PRO: { code: 'READING_PRO', title: 'Reading Pro', description: 'Scored 100% on a reading exercise.', icon: '▤', background: '#E8F5E9', foreground: '#1B5E20' },
  WRITING_STAR: { code: 'WRITING_STAR', title: 'Writing Star', description: 'Scored 100% on a writing task.', icon: '✍', background: '#FCE8E6', foreground: '#A50E0E' },
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DailyChallengeComponent, ClassPanelComponent],
  template: `
    <section aria-labelledby="dashboard-title">
      @if (auth.currentUser(); as user) {
        <div class="mb-8">
          <p class="text-sm font-semibold text-[#0A6B6B]">Your learning space</p>
          <h1 id="dashboard-title" class="font-display mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-4xl">Welcome back</h1>
        </div>

        @if (user.accountStatus === 'PENDING_APPROVAL') {
          <div role="status" class="mb-8 rounded-xl border border-[#F5A623]/50 bg-[#F5A623]/10 px-5 py-4 text-sm leading-6 text-[#4B5B5B] sm:px-6">
            <p class="font-semibold text-[#12302F]">Your teacher account is awaiting admin approval.</p>
            <p class="mt-1">You'll be able to create and manage exams once approved.</p>
          </div>
        } @else if (user.accountStatus === 'REJECTED') {
          <div role="alert" class="mb-8 rounded-xl border border-[#B42318]/40 bg-[#FDECEA] px-5 py-4 text-sm leading-6 text-[#7A1810] sm:px-6">
            Your account request was not approved. Contact support if you think this is a mistake.
          </div>
        }

        <article aria-labelledby="rewards-heading" class="relative mb-8 overflow-hidden rounded-2xl bg-[#0B3B3B] p-6 text-white shadow-sm sm:p-8">
          <div class="relative z-10">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#F5C56D]">Keep your momentum</p>
            <h2 id="rewards-heading" class="font-display mt-2 text-lg font-bold">Your rewards and streak</h2>
            <div class="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-10">
              <div>
                <p class="text-3xl font-extrabold tabular-nums tracking-tight sm:text-4xl">⭐ {{ pointsSummary()?.individualPoints ?? 0 }} <span class="text-lg font-bold">Points</span></p>
                @if (pointsLoading()) {
                  <p class="mt-1 text-sm text-white/80" role="status">Loading your points…</p>
                } @else if (pointsError()) {
                  <p class="mt-1 text-sm text-white/80" role="status">Points are temporarily unavailable.</p>
                }
                @if (!pointsLoading() && !pointsError() && pointsSummary()?.className && pointsSummary()?.classPoints !== null) {
                  <p class="mt-2 text-sm font-semibold text-white/90">Contributing to {{ pointsSummary()?.className }} ({{ pointsSummary()?.classPoints }} pts)</p>
                }
              </div>
              <div class="sm:border-l sm:border-white/20 sm:pl-8">
                <p class="text-2xl font-extrabold tracking-tight sm:text-3xl">🔥 {{ dashboardSummary()?.currentStreak ?? user.currentStreak }} Day Streak!</p>
                @if ((dashboardSummary()?.streakFreezes ?? user.streakFreezes) > 0) {
                  <p class="mt-2 text-sm text-white/85">You have {{ dashboardSummary()?.streakFreezes ?? user.streakFreezes }} Streak Freeze{{ (dashboardSummary()?.streakFreezes ?? user.streakFreezes) === 1 ? '' : 's' }}. Don't lose your chain!</p>
                } @else {
                  <p class="mt-2 text-sm text-white/85">Complete an exercise every day to keep your streak alive!</p>
                }
                @if (dashboardDataLoading()) { <p class="mt-2 text-sm font-semibold text-white/80" role="status">{{ dashboardLoadingMessage() }}</p> }
              </div>
            </div>
          </div>
          <span class="pointer-events-none absolute -bottom-8 -right-2 text-8xl opacity-10" aria-hidden="true">⭐</span>
        </article>

        <app-daily-challenge />

        <app-class-panel />

        <section aria-labelledby="achievements-heading" class="mt-8">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#0A6B6B]">Keep building your skills</p>
            <h2 id="achievements-heading" class="font-display mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#0B3B3B]">Your Achievements</h2>
          </div>
          @if (earnedBadges().length > 0) {
            <ul class="mt-5 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
              @for (badge of earnedBadges(); track badge.code) {
                <li>
                  <article class="flex h-full items-start gap-4 rounded-2xl border border-[#E1E7E3] bg-white p-5 shadow-sm">
                    <span aria-hidden="true" [style.background-color]="badge.background" [style.color]="badge.foreground" class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-extrabold">{{ badge.icon }}</span>
                    <div>
                      <h3 class="font-display text-base font-bold text-[#0B3B3B]">{{ badge.title }}</h3>
                      <p class="mt-1 text-sm leading-6 text-[#4B5B5B]">{{ badge.description }}</p>
                    </div>
                  </article>
                </li>
              }
            </ul>
          } @else {
            <p class="mt-4 rounded-xl border border-dashed border-[#C9D8D1] bg-white/70 p-5 text-sm leading-6 text-[#4B5B5B]" role="status">Complete exercises to earn badges!</p>
          }
        </section>

        <section aria-labelledby="progress-heading" class="mt-8">
          <article class="rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-7">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="progress-heading" class="font-display text-lg font-extrabold tracking-[-0.025em] text-[#0B3B3B]">Your progress</h2>
                <p class="mt-1 text-sm text-[#4B5B5B]">{{ currentChart() === 'timeline' ? 'Mock scores by exam section over time.' : 'Mock mastery percentages based on exercise scores.' }}</p>
              </div>
              <span class="rounded-full bg-[#E8F2F0] px-3 py-1.5 text-xs font-bold text-[#075B5B]">{{ currentChart() === 'timeline' ? 'Scores out of 100' : 'Mastery percentage' }}</span>
            </div>
            <div class="mt-5 inline-flex w-full max-w-md rounded-xl bg-[#F0F2EF] p-1" role="group" aria-label="Progress chart view">
              <button type="button" (click)="selectChart('timeline')" [attr.aria-pressed]="currentChart() === 'timeline'" [class.bg-white]="currentChart() === 'timeline'" [class.text-[#075B5B]]="currentChart() === 'timeline'" [class.shadow-sm]="currentChart() === 'timeline'" class="min-h-11 flex-1 rounded-lg px-3 py-2 text-sm font-bold text-[#536361] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Score Over Time</button>
              <button type="button" (click)="selectChart('mastery')" [attr.aria-pressed]="currentChart() === 'mastery'" [class.bg-white]="currentChart() === 'mastery'" [class.text-[#075B5B]]="currentChart() === 'mastery'" [class.shadow-sm]="currentChart() === 'mastery'" class="min-h-11 flex-1 rounded-lg px-3 py-2 text-sm font-bold text-[#536361] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Skill Mastery</button>
            </div>
            @if (currentChart() === 'timeline') {
              <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <label for="progress-time-range" class="text-sm font-semibold text-[#173E3D]">Time Range:</label>
                <select id="progress-time-range" [value]="selectedTimeRange()" (change)="selectTimeRange($any($event.target).value)" class="min-h-11 w-full max-w-xs rounded-lg border border-[#C9D1CF] bg-white px-3 text-sm font-semibold text-[#173E3D] focus:border-[#0A6B6B] focus:outline-none focus:ring-4 focus:ring-[#0A6B6B]/15">
                  @for (range of timeRangeOptions; track range.value) { <option [value]="range.value" [selected]="selectedTimeRange() === range.value">{{ range.label }}</option> }
                </select>
              </div>
            } @else {
              <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <label for="mastery-unit" class="text-sm font-semibold text-[#173E3D]">View:</label>
                <select id="mastery-unit" [value]="selectedUnit()" (change)="selectUnit($any($event.target).value)" class="min-h-11 w-full max-w-xs rounded-lg border border-[#C9D1CF] bg-white px-3 text-sm font-semibold text-[#173E3D] focus:border-[#0A6B6B] focus:outline-none focus:ring-4 focus:ring-[#0A6B6B]/15">
                  @for (unit of unitOptions; track unit.value) { <option [value]="unit.value" [selected]="selectedUnit() === unit.value">{{ unit.label }}</option> }
                </select>
              </div>
            }
            <div class="relative mt-5 h-80 w-full sm:h-96">
              <canvas #progressChart role="img" [attr.aria-label]="currentChart() === 'timeline' ? 'Line chart titled Exam Progress, showing Reading Comprehension, Vocabulary, Grammar, Function, and Writing scores for ' + selectedTimeRangeLabel() + '.' : 'Radar chart titled Skill Mastery, showing Vocabulary, Grammar, Reading, Function, and Writing mastery percentages for ' + selectedUnitLabel() + '.'" aria-describedby="progress-chart-description"></canvas>
            </div>
            <p id="progress-chart-description" class="sr-only">{{ currentChart() === 'timeline' ? 'Use View chart data to read exact scores for each section and time period.' : 'Use View chart data to read the exact mastery percentage for each skill.' }}</p>
            <details class="mt-4 rounded-xl border border-[#E5E7E5]">
              <summary class="min-h-11 cursor-pointer px-4 py-3 text-sm font-semibold text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">View chart data</summary>
              <div class="overflow-x-auto px-4 pb-4">
                @if (currentChart() === 'timeline') {
                  <table id="progress-chart-data" [attr.aria-label]="'Exam Progress scores for ' + selectedTimeRangeLabel()" class="min-w-[42rem] w-full border-collapse text-left text-sm">
                    <caption class="sr-only">Exam Progress scores for {{ selectedTimeRangeLabel() }}</caption>
                    <thead><tr class="border-b border-[#DDE5E1] text-[#173E3D]"><th scope="col" class="px-2 py-2 font-bold">{{ selectedTimeRangeLabel() === 'Last Week' ? 'Day' : 'Period' }}</th>@for (dataset of activeTimeline().datasets; track dataset.label) { <th scope="col" class="px-2 py-2 font-bold">{{ dataset.label }}</th> }</tr></thead>
                    <tbody>@for (period of activeTimeline().labels; track $index; let periodIndex = $index) { <tr class="border-b border-[#EDF0EE] last:border-0"><th scope="row" class="px-2 py-2 font-semibold text-[#173E3D]">{{ period }}</th>@for (dataset of activeTimeline().datasets; track dataset.label) { <td class="px-2 py-2 text-[#4B5B5B]">{{ dataset.data[periodIndex] }}</td> }</tr> }</tbody>
                  </table>
                } @else {
                  <table id="progress-chart-data" [attr.aria-label]="'Skill Mastery percentages for ' + selectedUnitLabel()" class="min-w-72 w-full border-collapse text-left text-sm">
                    <caption class="sr-only">Skill Mastery percentages for {{ selectedUnitLabel() }}</caption>
                    <thead><tr class="border-b border-[#DDE5E1] text-[#173E3D]"><th scope="col" class="px-2 py-2 font-bold">Skill</th><th scope="col" class="px-2 py-2 font-bold">Mastery</th></tr></thead>
                    <tbody>@for (skill of masterySkills(); track skill.label) { <tr class="border-b border-[#EDF0EE] last:border-0"><th scope="row" class="px-2 py-2 font-semibold text-[#173E3D]">{{ skill.label }}</th><td class="px-2 py-2 text-[#4B5B5B]">{{ skill.value }}%</td></tr> }</tbody>
                  </table>
                }
              </div>
            </details>
          </article>
        </section>
      }
    </section>
  `,
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private readonly http = inject(HttpClient);
  protected readonly auth = inject(AuthService);
  protected readonly dashboardDataLoading = signal(true);
  protected readonly dashboardLoadingMessage = signal(randomLoadingMessage());
  protected readonly dashboardSummary = signal<{ currentStreak: number; streakFreezes: number } | null>(null);
  protected readonly pointsSummary = signal<PointsSummary | null>(null);
  protected readonly pointsLoading = signal(true);
  protected readonly pointsError = signal(false);
  protected readonly earnedBadges = computed(() => {
    const earned = new Set((this.auth.currentUser()?.badges ?? '').split(',').map((badge) => badge.trim()).filter(Boolean));
    return Object.values(BADGE_CATALOG).filter((badge) => earned.has(badge.code));
  });
  @ViewChild('progressChart') private readonly progressCanvas?: ElementRef<HTMLCanvasElement>;
  protected readonly currentChart = signal<'timeline' | 'mastery'>('timeline');
  protected readonly selectedTimeRange = signal<TimeRange>('all');
  protected readonly selectedUnit = signal('all');

  protected readonly timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'all', label: 'All Time' },
  ];
  protected readonly unitOptions = [
    { value: 'all', label: 'All Units' },
    ...Array.from({ length: 10 }, (_, index) => ({ value: String(index + 1), label: `Unit ${index + 1}` })),
  ];

  private readonly timelineRanges: Record<TimeRange, TimelineRangeData> = {
    week: createTimelineData(
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      [
        [70, 72, 75, 74, 78, 82, 85],
        [60, 63, 65, 68, 70, 72, 75],
        [55, 58, 60, 62, 65, 68, 70],
        [80, 82, 84, 85, 88, 90, 92],
        [45, 48, 50, 54, 58, 62, 65],
      ],
    ),
    month: createTimelineData(
      ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      [
        [62, 67, 73, 80],
        [52, 59, 66, 73],
        [43, 51, 60, 68],
        [71, 76, 82, 89],
        [32, 41, 51, 62],
      ],
    ),
    all: createTimelineData(
      ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      [
        [60, 65, 70, 75, 80, 85],
        [50, 60, 65, 70, 75, 80],
        [40, 50, 55, 65, 70, 75],
        [70, 75, 80, 85, 90, 95],
        [30, 40, 45, 55, 60, 70],
      ],
    ),
  };
  protected readonly activeTimeline = computed(() => this.timelineRanges[this.selectedTimeRange()]);

  // Temporary exercise history until dashboard progress is available from the API.
  private readonly mockExerciseHistory: Record<string, Partial<Record<MasterySkill, number[]>>> = {
    '1': { Vocabulary: [80], Grammar: [70], Reading: [85], Function: [90], Writing: [60] },
    '2': { Vocabulary: [76, 84], Grammar: [68, 72], Reading: [78], Function: [84, 88], Writing: [55, 65] },
    '3': { Vocabulary: [90], Grammar: [80], Reading: [82], Function: [92], Writing: [70] },
  };

  protected readonly masterySkills = computed(() => (['Vocabulary', 'Grammar', 'Reading', 'Function', 'Writing'] as MasterySkill[]).map((label) => ({
    label,
    value: this.calculateSkillMastery(label, this.selectedUnit()),
  })));

  private chart?: Chart;

  constructor() {
    this.http.get<{ currentStreak: number; streakFreezes: number }>('/api/progress/dashboard')
      .pipe(finalize(() => this.dashboardDataLoading.set(false)))
      .subscribe({
        next: (summary) => this.dashboardSummary.set(summary),
        error: () => this.dashboardSummary.set(null),
      });
    this.http.get<PointsSummary>('/api/progress/points')
      .pipe(finalize(() => this.pointsLoading.set(false)))
      .subscribe({
        next: (summary) => this.pointsSummary.set(summary),
        error: () => this.pointsError.set(true),
      });
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  protected selectChart(chart: 'timeline' | 'mastery'): void {
    if (this.currentChart() === chart) return;
    this.currentChart.set(chart);
    this.renderChart();
  }

  protected selectTimeRange(value: string): void {
    if (!this.timeRangeOptions.some((option) => option.value === value)) return;
    this.selectedTimeRange.set(value as TimeRange);
    this.renderChart();
  }

  protected selectUnit(value: string): void {
    if (!this.unitOptions.some((option) => option.value === value)) return;
    this.selectedUnit.set(value);
    this.renderChart();
  }

  protected selectedTimeRangeLabel(): string {
    return this.timeRangeOptions.find((option) => option.value === this.selectedTimeRange())?.label ?? 'All Time';
  }

  protected selectedUnitLabel(): string {
    return this.unitOptions.find((option) => option.value === this.selectedUnit())?.label ?? 'All Units';
  }

  private calculateSkillMastery(skill: MasterySkill, unit: string): number {
    const unitHistory = unit === 'all'
      ? Object.values(this.mockExerciseHistory)
      : [this.mockExerciseHistory[unit] ?? {}];
    const scores = unitHistory.flatMap((history) => history[skill] ?? []);
    return this.averageScore(scores);
  }

  private averageScore(scores: number[]): number {
    return scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : 0;
  }

  private renderChart(): void {
    const canvas = this.progressCanvas?.nativeElement;
    if (!canvas) return;

    this.chart?.destroy();
    if (this.currentChart() === 'timeline') {
      const timeline = this.activeTimeline();
      this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: timeline.labels,
        datasets: timeline.datasets.map(({ label, data, color }) => ({
          label,
          data,
          borderColor: color,
          backgroundColor: color,
          borderWidth: 3,
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4,
          fill: false,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          title: {
            display: true,
            text: 'Exam Progress',
            color: '#263434',
            font: { size: 18, weight: 'bold' },
            padding: { bottom: 16 },
          },
          legend: {
            position: 'top',
            align: 'center',
            labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, boxHeight: 8, padding: 16, color: '#344747' },
          },
          tooltip: {
            callbacks: { label: (context) => `${context.dataset.label}: ${context.parsed.y} / 100` },
          },
        },
        scales: {
          x: {
            grid: { color: '#E8ECE9' },
            border: { color: '#CCD5D0' },
            ticks: { color: '#536361' },
          },
          y: {
            beginAtZero: true,
            min: 0,
            max: 100,
            ticks: { stepSize: 20, color: '#536361' },
            grid: { color: '#E8ECE9' },
            border: { color: '#CCD5D0' },
          },
        },
      },
      });
      return;
    }

    const masterySkills = this.masterySkills();
    this.chart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: masterySkills.map((skill) => skill.label),
        datasets: [{
          label: 'Mastery',
          data: masterySkills.map((skill) => skill.value),
          borderColor: '#0A6B6B',
          backgroundColor: 'rgba(10, 107, 107, 0.3)',
          borderWidth: 3,
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#0A6B6B',
          pointBorderColor: '#FFFFFF',
          tension: 0.2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Skill Mastery',
            color: '#263434',
            font: { size: 18, weight: 'bold' },
            padding: { bottom: 16 },
          },
          legend: {
            position: 'top',
            align: 'center',
            labels: { usePointStyle: true, pointStyle: 'circle', color: '#344747' },
          },
          tooltip: {
            callbacks: { label: (context) => `${context.label}: ${context.parsed.r}%` },
          },
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { stepSize: 20, showLabelBackdrop: false, color: '#536361' },
            pointLabels: { color: '#344747', font: { size: 12, weight: 'bold' } },
            grid: { color: '#DDE5E1' },
            angleLines: { color: '#DDE5E1' },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
