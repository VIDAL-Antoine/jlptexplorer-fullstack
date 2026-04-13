import { grammarPoints } from './api/grammar-points';
import { scenes } from './api/scenes';
import { sources } from './api/sources';
import { speakers } from './api/speakers';

export { apiFetch } from './api/client';
export * from './api/types';

export const api = { grammarPoints, sources, scenes, speakers };
