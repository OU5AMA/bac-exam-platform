export const AVATAR_OPTIONS = [
  { emoji: '🦉', label: 'Owl' },
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🤖', label: 'Robot' },
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐬', label: 'Dolphin' },
  { emoji: '🚀', label: 'Rocket' },
] as const;

export function isAvatarEmoji(value: string | null | undefined): boolean {
  return AVATAR_OPTIONS.some((avatar) => avatar.emoji === value);
}

export function avatarName(value: string | null | undefined): string | null {
  return AVATAR_OPTIONS.find((avatar) => avatar.emoji === value)?.label ?? null;
}
