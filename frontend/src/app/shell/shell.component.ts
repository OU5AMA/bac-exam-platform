import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="mx-auto w-full max-w-7xl px-5 py-8 text-[#4B5B5B] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      <router-outlet />
    </main>
  `,
})
export class ShellComponent {}
