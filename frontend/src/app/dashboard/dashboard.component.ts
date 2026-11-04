import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import Chart from 'chart.js/auto';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <section aria-labelledby="dashboard-title">
      @if (auth.currentUser(); as user) {
        <div class="mb-8">
          <p class="text-sm font-semibold text-[#0A6B6B]">Your learning space</p>
          <h1 id="dashboard-title" class="font-display mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0B3B3B] sm:text-4xl">Welcome back</h1>
          <p class="mt-2 text-base text-[#4B5B5B]">{{ user.displayName || user.username || user.email }}</p>
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

        <div class="grid gap-4 md:grid-cols-2 md:gap-5">
          <article class="rounded-2xl border border-[#E5E7E5] bg-white p-6 sm:p-7">
            <div class="flex items-start justify-between gap-3">
              <h2 class="font-display text-lg font-extrabold tracking-[-0.025em] text-[#0B3B3B]">Your exams</h2>
              <span class="rounded-full bg-[#F7F5F0] px-2.5 py-1 text-[11px] font-semibold text-[#4B5B5B]">Coming soon</span>
            </div>
            <p class="mt-4 text-sm leading-6 text-[#4B5B5B]">Exams assigned to you will appear here.</p>
          </article>
          <article class="rounded-2xl border border-[#E5E7E5] bg-white p-6 sm:p-7">
            <div class="flex items-start justify-between gap-3">
              <h2 class="font-display text-lg font-extrabold tracking-[-0.025em] text-[#0B3B3B]">Your class</h2>
              <span class="rounded-full bg-[#F7F5F0] px-2.5 py-1 text-[11px] font-semibold text-[#4B5B5B]">Coming soon</span>
            </div>
            <p class="mt-4 text-sm leading-6 text-[#4B5B5B]">See who else is learning with you.</p>
          </article>
          <article class="rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm md:col-span-2 sm:p-7">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 class="font-display text-lg font-extrabold tracking-[-0.025em] text-[#0B3B3B]">Your progress</h2>
                <p class="mt-1 text-sm text-[#4B5B5B]">Mock scores by exam section over six weeks.</p>
              </div>
              <span class="rounded-full bg-[#E8F2F0] px-3 py-1.5 text-xs font-bold text-[#075B5B]">Scores out of 100</span>
            </div>
            <div class="relative mt-5 h-80 w-full sm:h-96">
              <canvas #progressChart role="img" aria-label="Multi-line chart titled Exam Progress, showing Reading Comprehension, Vocabulary, Grammar, Function, and Writing scores across six weeks." aria-describedby="progress-chart-data"></canvas>
            </div>
            <details class="mt-4 rounded-xl border border-[#E5E7E5]">
              <summary class="min-h-11 cursor-pointer px-4 py-3 text-sm font-semibold text-[#0A6B6B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">View chart data</summary>
              <div class="overflow-x-auto px-4 pb-4">
                <table id="progress-chart-data" class="min-w-[42rem] w-full border-collapse text-left text-sm">
                  <caption class="sr-only">Exam Progress scores by section and week</caption>
                  <thead><tr class="border-b border-[#DDE5E1] text-[#173E3D]"><th scope="col" class="px-2 py-2 font-bold">Week</th>@for (dataset of progressDatasets; track dataset.label) { <th scope="col" class="px-2 py-2 font-bold">{{ dataset.label }}</th> }</tr></thead>
                  <tbody>@for (week of weeks; track $index) { <tr class="border-b border-[#EDF0EE] last:border-0"><th scope="row" class="px-2 py-2 font-semibold text-[#173E3D]">{{ week }}</th>@for (dataset of progressDatasets; track dataset.label) { <td class="px-2 py-2 text-[#4B5B5B]">{{ dataset.data[$index] }}</td> }</tr> }</tbody>
                </table>
              </div>
            </details>
          </article>
        </div>
      }
    </section>
  `,
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  protected readonly auth = inject(AuthService);
  @ViewChild('progressChart') private readonly progressCanvas?: ElementRef<HTMLCanvasElement>;

  protected readonly weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
  protected readonly progressDatasets = [
    { label: 'Reading Comprehension', data: [60, 65, 70, 75, 80, 85], color: '#16A34A' },
    { label: 'Vocabulary', data: [50, 60, 65, 70, 75, 80], color: '#7C3AED' },
    { label: 'Grammar', data: [40, 50, 55, 65, 70, 75], color: '#F97316' },
    { label: 'Function', data: [70, 75, 80, 85, 90, 95], color: '#2563EB' },
    { label: 'Writing', data: [30, 40, 45, 55, 60, 70], color: '#DC2626' },
  ];

  private chart?: Chart;

  ngAfterViewInit(): void {
    const canvas = this.progressCanvas?.nativeElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.weeks,
        datasets: this.progressDatasets.map(({ label, data, color }) => ({
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
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
