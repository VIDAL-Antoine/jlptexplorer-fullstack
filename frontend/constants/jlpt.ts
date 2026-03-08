export const JLPT_LEVEL_COLORS = {
  N5: 'green',
  N4: 'teal',
  N3: 'blue',
  N2: 'orange',
  N1: 'red',
} as const;

export type JlptLevel = keyof typeof JLPT_LEVEL_COLORS;
