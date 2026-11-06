export const LOADING_MESSAGES = [
  'Brewing some grammar tea... ☕',
  'Asking the AI for a hint... 🤖',
  'Sharpening pencils... ✏️',
  'Calculating your genius level... 🧠',
  'One moment, the teacher is checking your work... 👨‍🏫',
] as const;

export function randomLoadingMessage(): string {
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
}
