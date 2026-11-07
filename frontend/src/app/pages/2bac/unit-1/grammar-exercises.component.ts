import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import confetti from 'canvas-confetti';

interface GrammarQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface GrammarExercise {
  id: number;
  title: string;
  focus: string;
  questions: GrammarQuestion[];
}

@Component({
  selector: 'app-grammar-exercises',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#344C4B] sm:px-6 sm:py-10 lg:px-10">
      <div class="mx-auto max-w-4xl">
        <a routerLink="/2-bac/unit/1/grammar" class="inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-[#0A6B6B] hover:text-[#084F4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A6B6B]">
          <span aria-hidden="true" class="mr-2 text-lg">←</span> Back to Grammar Lesson
        </a>

        <header class="mt-6 rounded-2xl bg-[#0B3B3B] p-6 text-white shadow-sm sm:p-9">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#F5C56D]">2BAC English · Unit 1</p>
          <h1 class="font-display mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Grammar Practice</h1>
          <p class="mt-3 max-w-2xl leading-7 text-white/85">Choose an exercise, answer each question, then check your work to see your score and explanations.</p>
        </header>

        <section aria-labelledby="exercise-picker-title" class="mt-6 rounded-2xl border border-[#E5E7E5] bg-white p-5 shadow-sm sm:p-8">
          <label id="exercise-picker-title" for="exercise-picker" class="block text-sm font-bold text-[#0B3B3B]">Choose an exercise</label>
          <select id="exercise-picker" [value]="selectedExerciseId()" (change)="selectExercise($event)" class="mt-2 min-h-12 w-full max-w-md rounded-lg border border-[#AAB8B4] bg-white px-3 text-base text-[#173E3D] focus:border-[#0A6B6B] focus:outline-2 focus:outline-offset-2 focus:outline-[#0A6B6B]">
            @for (exercise of exercises; track exercise.id) {
              <option [value]="exercise.id">Exercise {{ exercise.id }} · {{ exercise.focus }}</option>
            }
          </select>

          <div class="mt-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-[#0A6B6B]">Exercise {{ activeExercise().id }} of {{ exercises.length }}</p>
              <h2 class="font-display mt-1 text-2xl font-extrabold text-[#0B3B3B]">{{ activeExercise().title }}</h2>
            </div>
            <span class="rounded-full bg-[#E8F2F0] px-3 py-2 text-sm font-semibold text-[#075B5B]">{{ activeExercise().questions.length }} questions</span>
          </div>

          <div class="mt-5 space-y-5">
            @for (group of questionGroups(); track group.start) {
              <section class="rounded-2xl border border-[#DDE6E1] bg-[#FAFCFB] p-4 sm:p-5" [attr.aria-labelledby]="'question-group-' + group.start">
                <h3 [id]="'question-group-' + group.start" class="font-display text-lg font-bold text-[#0B3B3B]">Questions {{ group.start }}–{{ group.end }}</h3>
                <div class="mt-3 space-y-4">
                  @for (item of group.items; track item.question.id) {
                    <fieldset class="rounded-xl border border-[#E5E7E5] bg-white p-4 sm:p-5">
                      <legend class="px-1 text-base font-bold leading-6 text-[#173E3D]">{{ item.index }}. {{ item.question.prompt }}</legend>
                      <div class="mt-2 grid gap-2 sm:grid-cols-3">
                        @for (option of item.question.options; track option) {
                          <label class="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-[#D8E0DC] px-3 hover:bg-[#F5F8F6] has-[:checked]:border-[#0A6B6B] has-[:checked]:bg-[#E8F2F0]">
                            <input type="radio" [name]="item.question.id" [value]="option" [checked]="answers()[item.question.id] === option" [disabled]="checked()" (change)="setAnswer(item.question.id, option)" class="h-4 w-4 accent-[#0A6B6B]">
                            <span class="text-sm font-semibold text-[#173E3D]">{{ option }}</span>
                          </label>
                        }
                      </div>
                      @if (checked()) {
                        <p class="mt-3 rounded-lg p-3 text-sm font-semibold" role="status" [class.bg-[#E8F3EC]]="answers()[item.question.id] === item.question.answer" [class.text-[#176346]]="answers()[item.question.id] === item.question.answer" [class.bg-[#FFF4DC]]="answers()[item.question.id] !== item.question.answer" [class.text-[#805300]]="answers()[item.question.id] !== item.question.answer">
                          {{ answers()[item.question.id] === item.question.answer ? 'Correct.' : 'Not quite.' }} {{ item.question.explanation }}
                        </p>
                      }
                    </fieldset>
                  }
                </div>
              </section>
            }
          </div>

          @if (!checked()) {
            <button type="button" (click)="checkAnswers()" [disabled]="!complete()" class="mt-5 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0A6B6B] px-5 text-sm font-bold text-white hover:bg-[#084F4F] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Check Answers</button>
            @if (!complete()) { <p class="mt-2 text-sm text-[#667575]" role="status">Answer every question to check your work.</p> }
          } @else {
            <p class="mt-5 rounded-xl border border-[#B8D7D0] bg-[#E8F2F0] p-4 text-base font-semibold text-[#084F4F]" role="status" aria-live="polite">{{ resultMessage() }}</p>
            <div class="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-[#F4F7F5] p-4">
              <p class="flex-1 text-sm font-bold text-[#173E3D]" role="status" aria-live="polite">You scored {{ score() }} / {{ activeExercise().questions.length }}.</p>
              <button type="button" (click)="tryAgain()" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0A6B6B] px-4 text-sm font-bold text-[#075B5B] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A6B6B]">Try again</button>
            </div>
          }
        </section>
      </div>
    </main>
  `,
})
export class GrammarExercisesComponent {
  private readonly http = inject(HttpClient);
  protected readonly exercises: GrammarExercise[] = [
    {
      id: 1,
      title: 'The Full Infinitive',
      focus: 'Full infinitive',
      questions: [
        { id: 'ex1-q1', prompt: 'I hope ___ a good mark.', options: ['get', 'to get', 'getting'], answer: 'to get', explanation: 'Use to + base verb after hope.' },
        { id: 'ex1-q2', prompt: 'They decided ___ abroad.', options: ['to study', 'studying', 'study'], answer: 'to study', explanation: 'Use the full infinitive after decide.' },
        { id: 'ex1-q3', prompt: 'She promised ___ us.', options: ['helping', 'help', 'to help'], answer: 'to help', explanation: 'Use to + base verb after promise.' },
        { id: 'ex1-q4', prompt: 'We plan ___ early.', options: ['leave', 'leaving', 'to leave'], answer: 'to leave', explanation: 'Use the full infinitive after plan.' },
        { id: 'ex1-q5', prompt: 'I need ___ the instructions.', options: ['to read', 'read', 'reading'], answer: 'to read', explanation: 'Use to + base verb after need.' },
        { id: 'ex1-q6', prompt: 'Omar wants ___ a doctor.', options: ['become', 'to become', 'becoming'], answer: 'to become', explanation: 'Use the full infinitive after want.' },
        { id: 'ex1-q7', prompt: 'We hope ___ our cousins this summer.', options: ['to visit', 'visiting', 'visit'], answer: 'to visit', explanation: 'Use to + base verb after hope.' },
        { id: 'ex1-q8', prompt: 'Lina decided ___ the school club.', options: ['joining', 'join', 'to join'], answer: 'to join', explanation: 'Use the full infinitive after decide.' },
        { id: 'ex1-q9', prompt: 'My friends plan ___ the old town.', options: ['to explore', 'exploring', 'explore'], answer: 'to explore', explanation: 'Use to + base verb after plan.' },
        { id: 'ex1-q10', prompt: 'You need ___ your name here.', options: ['writing', 'to write', 'write'], answer: 'to write', explanation: 'Use the full infinitive after need.' },
        { id: 'ex1-q11', prompt: 'I promise ___ you after class.', options: ['call', 'calling', 'to call'], answer: 'to call', explanation: 'Use to + base verb after promise.' },
        { id: 'ex1-q12', prompt: 'He offered ___ the heavy bag.', options: ['to carry', 'carry', 'carrying'], answer: 'to carry', explanation: 'Use the full infinitive after offer.' },
        { id: 'ex1-q13', prompt: 'They agreed ___ with us.', options: ['coming', 'to come', 'come'], answer: 'to come', explanation: 'Use to + base verb after agree.' },
        { id: 'ex1-q14', prompt: 'The bus expects ___ at six.', options: ['arriving', 'arrive', 'to arrive'], answer: 'to arrive', explanation: 'Use the full infinitive after expect.' },
        { id: 'ex1-q15', prompt: 'I am learning ___ a car.', options: ['to drive', 'drive', 'driving'], answer: 'to drive', explanation: 'Use to + base verb after learn.' },
        { id: 'ex1-q16', prompt: 'Maya chose ___ at home today.', options: ['stay', 'staying', 'to stay'], answer: 'to stay', explanation: 'Use the full infinitive after choose.' },
        { id: 'ex1-q17', prompt: 'The child refused ___ the question.', options: ['answer', 'to answer', 'answering'], answer: 'to answer', explanation: 'Use to + base verb after refuse.' },
        { id: 'ex1-q18', prompt: 'We managed ___ the problem.', options: ['to solve', 'solve', 'solving'], answer: 'to solve', explanation: 'Use the full infinitive after manage.' },
        { id: 'ex1-q19', prompt: 'She seems ___ the rule.', options: ['understand', 'understanding', 'to understand'], answer: 'to understand', explanation: 'Use to + base verb after seem.' },
        { id: 'ex1-q20', prompt: 'I would like ___ the new teacher.', options: ['meet', 'meeting', 'to meet'], answer: 'to meet', explanation: 'Use the full infinitive after would like.' },
      ],
    },
    {
      id: 2,
      title: 'The Bare Infinitive',
      focus: 'Bare infinitive',
      questions: [
        { id: 'ex2-q1', prompt: 'My sister can ___ very well.', options: ['to swim', 'swimming', 'swim'], answer: 'swim', explanation: 'Use the base verb without to after can.' },
        { id: 'ex2-q2', prompt: 'Please let him ___.', options: ['go', 'to go', 'going'], answer: 'go', explanation: 'Use the bare infinitive after let.' },
        { id: 'ex2-q3', prompt: 'You must ___ your homework.', options: ['finish', 'to finish', 'finishing'], answer: 'finish', explanation: 'Use the base verb after must.' },
        { id: 'ex2-q4', prompt: 'The film made us ___.', options: ['to laugh', 'laugh', 'laughing'], answer: 'laugh', explanation: 'Use the bare infinitive after make + object.' },
        { id: 'ex2-q5', prompt: 'We should ___ on time.', options: ['arrive', 'arriving', 'to arrive'], answer: 'arrive', explanation: 'Use the base verb after should.' },
        { id: 'ex2-q6', prompt: 'It might ___ later today.', options: ['rain', 'to rain', 'raining'], answer: 'rain', explanation: 'Use the base verb after might.' },
        { id: 'ex2-q7', prompt: 'I will ___ you tomorrow.', options: ['to call', 'call', 'calling'], answer: 'call', explanation: 'Use the base verb after will.' },
        { id: 'ex2-q8', prompt: 'You can ___ your dictionary.', options: ['use', 'using', 'to use'], answer: 'use', explanation: 'Use the base verb after can.' },
        { id: 'ex2-q9', prompt: 'We must ___ our seat belts.', options: ['wearing', 'wear', 'to wear'], answer: 'wear', explanation: 'Use the bare infinitive after must.' },
        { id: 'ex2-q10', prompt: 'You should ___ your notes before the test.', options: ['review', 'to review', 'reviewing'], answer: 'review', explanation: 'Use the base verb after should.' },
        { id: 'ex2-q11', prompt: 'My brother might ___ with us.', options: ['come', 'coming', 'to come'], answer: 'come', explanation: 'Use the base verb after might.' },
        { id: 'ex2-q12', prompt: 'May I ___ the classroom?', options: ['leave', 'to leave', 'leaving'], answer: 'leave', explanation: 'Use the bare infinitive after may.' },
        { id: 'ex2-q13', prompt: 'Let me ___ the map.', options: ['to check', 'checking', 'check'], answer: 'check', explanation: 'Use the base verb after let + object.' },
        { id: 'ex2-q14', prompt: 'The coach made the players ___.', options: ['to run', 'run', 'running'], answer: 'run', explanation: 'Use the bare infinitive after make + object.' },
        { id: 'ex2-q15', prompt: 'Will you ___ the door, please?', options: ['open', 'opening', 'to open'], answer: 'open', explanation: 'Use the base verb after will.' },
        { id: 'ex2-q16', prompt: 'Students must ___ quietly in the library.', options: ['to speak', 'speak', 'speaking'], answer: 'speak', explanation: 'Use the bare infinitive after must.' },
        { id: 'ex2-q17', prompt: 'My aunt can ___ three languages.', options: ['to speak', 'speaking', 'speak'], answer: 'speak', explanation: 'Use the base verb after can.' },
        { id: 'ex2-q18', prompt: 'Should we ___ for the bus here?', options: ['wait', 'waiting', 'to wait'], answer: 'wait', explanation: 'Use the base verb after should.' },
        { id: 'ex2-q19', prompt: 'They might ___ the match this weekend.', options: ['to watch', 'watching', 'watch'], answer: 'watch', explanation: 'Use the bare infinitive after might.' },
        { id: 'ex2-q20', prompt: 'The joke made everyone ___.', options: ['smile', 'to smile', 'smiling'], answer: 'smile', explanation: 'Use the base verb after make + object.' },
      ],
    },
    {
      id: 3,
      title: 'Gerunds after Verbs and Prepositions',
      focus: 'Gerunds',
      questions: [
        { id: 'ex3-q1', prompt: 'I enjoy ___ novels.', options: ['read', 'to read', 'reading'], answer: 'reading', explanation: 'Use a gerund after enjoy.' },
        { id: 'ex3-q2', prompt: 'He is interested in ___ French.', options: ['learning', 'learn', 'to learn'], answer: 'learning', explanation: 'Use a gerund after a preposition such as in.' },
        { id: 'ex3-q3', prompt: 'Mina avoids ___ mistakes.', options: ['make', 'making', 'to make'], answer: 'making', explanation: 'Use a gerund after avoid.' },
        { id: 'ex3-q4', prompt: 'They finished ___ the report.', options: ['to write', 'writing', 'write'], answer: 'writing', explanation: 'Use a gerund after finish.' },
        { id: 'ex3-q5', prompt: 'My brother is good at ___.', options: ['draw', 'to draw', 'drawing'], answer: 'drawing', explanation: 'Use a gerund after the preposition at.' },
        { id: 'ex3-q6', prompt: 'She enjoys ___ with her friends.', options: ['dancing', 'dance', 'to dance'], answer: 'dancing', explanation: 'Use a gerund after enjoy.' },
        { id: 'ex3-q7', prompt: 'He avoids ___ too fast.', options: ['drive', 'driving', 'to drive'], answer: 'driving', explanation: 'Use a gerund after avoid.' },
        { id: 'ex3-q8', prompt: 'They are interested in ___ Arabic.', options: ['learn', 'learning', 'to learn'], answer: 'learning', explanation: 'Use a gerund after a preposition.' },
        { id: 'ex3-q9', prompt: 'We finished ___ the room.', options: ['cleaning', 'clean', 'to clean'], answer: 'cleaning', explanation: 'Use a gerund after finish.' },
        { id: 'ex3-q10', prompt: 'Would you mind ___ here?', options: ['sit', 'sitting', 'to sit'], answer: 'sitting', explanation: 'Use a gerund after mind; sit doubles its final consonant before -ing.' },
        { id: 'ex3-q11', prompt: 'Add -ing to take: ___.', options: ['takeing', 'taking', 'tacking'], answer: 'taking', explanation: 'Drop the silent e in take before adding -ing.' },
        { id: 'ex3-q12', prompt: 'Add -ing to write: ___.', options: ['writing', 'writeing', 'writting'], answer: 'writing', explanation: 'Drop the silent e in write before adding -ing.' },
        { id: 'ex3-q13', prompt: 'Add -ing to run: ___.', options: ['runing', 'running', 'runeing'], answer: 'running', explanation: 'Double the final consonant in run before adding -ing.' },
        { id: 'ex3-q14', prompt: 'Add -ing to shop: ___.', options: ['shoping', 'shopping', 'shopeing'], answer: 'shopping', explanation: 'Double the final consonant in shop before adding -ing.' },
        { id: 'ex3-q15', prompt: 'Add -ing to play: ___.', options: ['plaing', 'playing', 'playying'], answer: 'playing', explanation: 'For most verbs, add -ing without changing the spelling.' },
        { id: 'ex3-q16', prompt: 'Add -ing to read: ___.', options: ['reading', 'readding', 'readng'], answer: 'reading', explanation: 'For most verbs, simply add -ing.' },
        { id: 'ex3-q17', prompt: 'Add -ing to live: ___.', options: ['liveing', 'living', 'livving'], answer: 'living', explanation: 'Drop the silent e before adding -ing.' },
        { id: 'ex3-q18', prompt: 'Add -ing to swim: ___.', options: ['swiming', 'swimming', 'swimning'], answer: 'swimming', explanation: 'Double the final consonant in swim before adding -ing.' },
        { id: 'ex3-q19', prompt: 'Add -ing to plan: ___.', options: ['planing', 'planning', 'planeing'], answer: 'planning', explanation: 'Double the final consonant in plan before adding -ing.' },
        { id: 'ex3-q20', prompt: 'She is good at ___ (sing).', options: ['sing', 'to sing', 'singing'], answer: 'singing', explanation: 'Use a gerund after the preposition at.' },
      ],
    },
    {
      id: 4,
      title: 'Mixed Forms and -ing Spelling',
      focus: 'Mixed review',
      questions: [
        { id: 'ex4-q1', prompt: 'The teacher suggested ___ in pairs.', options: ['working', 'to work', 'work'], answer: 'working', explanation: 'Use a gerund after suggest.' },
        { id: 'ex4-q2', prompt: 'Would you mind ___ the window?', options: ['open', 'opening', 'to open'], answer: 'opening', explanation: 'Use a gerund after mind.' },
        { id: 'ex4-q3', prompt: 'She would like ___ the museum.', options: ['visit', 'visiting', 'to visit'], answer: 'to visit', explanation: 'Use the full infinitive after would like.' },
        { id: 'ex4-q4', prompt: 'The dog is ___ after the ball.', options: ['runing', 'running', 'run'], answer: 'running', explanation: 'Double the final consonant in run before adding -ing.' },
        { id: 'ex4-q5', prompt: 'I am ___ a letter to my friend.', options: ['writeing', 'writing', 'write'], answer: 'writing', explanation: 'Drop the silent e in write before adding -ing.' },
        { id: 'ex4-q6', prompt: 'Nadia hopes ___ the exam.', options: ['pass', 'to pass', 'passing'], answer: 'to pass', explanation: 'Use the full infinitive after hope.' },
        { id: 'ex4-q7', prompt: 'You must ___ your work carefully.', options: ['check', 'to check', 'checking'], answer: 'check', explanation: 'Use the bare infinitive after must.' },
        { id: 'ex4-q8', prompt: 'He enjoys ___ dinner for his family.', options: ['cook', 'cooking', 'to cook'], answer: 'cooking', explanation: 'Use a gerund after enjoy.' },
        { id: 'ex4-q9', prompt: 'Let us ___ the activity again.', options: ['to try', 'try', 'trying'], answer: 'try', explanation: 'Use the bare infinitive after let.' },
        { id: 'ex4-q10', prompt: 'She is good at ___ problems.', options: ['solve', 'to solve', 'solving'], answer: 'solving', explanation: 'Use a gerund after the preposition at.' },
        { id: 'ex4-q11', prompt: 'They decided ___ to a new flat.', options: ['moving', 'move', 'to move'], answer: 'to move', explanation: 'Use the full infinitive after decide.' },
        { id: 'ex4-q12', prompt: 'My father can ___ a truck.', options: ['drive', 'to drive', 'driving'], answer: 'drive', explanation: 'Use the bare infinitive after can.' },
        { id: 'ex4-q13', prompt: 'I finished ___ my desk.', options: ['to tidy', 'tidying', 'tidy'], answer: 'tidying', explanation: 'Use a gerund after finish.' },
        { id: 'ex4-q14', prompt: 'The teacher made us ___ the sentence.', options: ['rewrite', 'to rewrite', 'rewriting'], answer: 'rewrite', explanation: 'Use the bare infinitive after make + object.' },
        { id: 'ex4-q15', prompt: 'He avoids ___ late.', options: ['to arrive', 'arriving', 'arrive'], answer: 'arriving', explanation: 'Use a gerund after avoid.' },
        { id: 'ex4-q16', prompt: 'We plan ___ by train.', options: ['travel', 'traveling', 'to travel'], answer: 'to travel', explanation: 'Use the full infinitive after plan.' },
        { id: 'ex4-q17', prompt: 'You should ___ a warm coat.', options: ['bring', 'bringing', 'to bring'], answer: 'bring', explanation: 'Use the bare infinitive after should.' },
        { id: 'ex4-q18', prompt: 'She stopped ___ to the radio.', options: ['listening', 'listen', 'to listening'], answer: 'listening', explanation: 'Use a gerund after stop when it means ending an activity.' },
        { id: 'ex4-q19', prompt: 'I hope ___ you again soon.', options: ['seeing', 'see', 'to see'], answer: 'to see', explanation: 'Use the full infinitive after hope.' },
        { id: 'ex4-q20', prompt: 'The children might ___ after lunch.', options: ['to play', 'playing', 'play'], answer: 'play', explanation: 'Use the bare infinitive after might.' },
      ],
    },
  ];
  protected readonly selectedExerciseId = signal(1);
  protected readonly activeExercise = computed(() => this.exercises.find((exercise) => exercise.id === this.selectedExerciseId()) ?? this.exercises[0]);
  protected readonly questionGroups = computed(() => {
    const questions = this.activeExercise().questions;
    return Array.from({ length: Math.ceil(questions.length / 5) }, (_, groupIndex) => {
      const startIndex = groupIndex * 5;
      const items = questions.slice(startIndex, startIndex + 5).map((question, index) => ({ question, index: startIndex + index + 1 }));
      return { start: startIndex + 1, end: startIndex + items.length, items };
    });
  });
  protected readonly answers = signal<Record<string, string>>({});
  protected readonly checked = signal(false);
  protected readonly resultMessage = signal('');
  protected readonly complete = computed(() => this.activeExercise().questions.every((question) => Boolean(this.answers()[question.id])));
  protected readonly score = computed(() => this.activeExercise().questions.filter((question) => this.answers()[question.id] === question.answer).length);

  protected selectExercise(event: Event): void {
    const exerciseId = Number((event.target as HTMLSelectElement).value);
    this.selectedExerciseId.set(exerciseId);
    this.answers.set({});
    this.checked.set(false);
    this.resultMessage.set('');
  }

  protected setAnswer(questionId: string, answer: string): void {
    this.answers.update((current) => ({ ...current, [questionId]: answer }));
  }

  protected checkAnswers(): void {
    if (!this.complete() || this.checked()) return;
    const percentage = (this.score() / this.activeExercise().questions.length) * 100;
    this.resultMessage.set(percentage === 100 ? 'Wow! You are a true champion. Perfect score! 🏆' : percentage >= 70 ? "Great job! You're getting really good at this. Keep it up! 💪" : percentage >= 40 ? "Not bad! A quick review of the lesson and you'll ace it next time. 📚" : "Don't worry, even Shakespeare made mistakes. Try again! ✍️");
    if (percentage >= 70) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#0A6B6B', '#F5A623', '#1565C0'] });
    this.checked.set(true);
    this.http.post('/api/progress/save', {
      unitNumber: 1,
      skill: 'GRAMMAR',
      score: this.score(),
      maxScore: 20,
    }).subscribe({ error: (error) => console.error('Could not save grammar progress', error) });
  }

  protected tryAgain(): void {
    this.answers.set({});
    this.checked.set(false);
    this.resultMessage.set('');
  }
}
