export { apiFetch } from './api/client';
export * from './api/types';

import { grammarPoints } from './api/grammar-points';
import { sources } from './api/sources';
import { scenes } from './api/scenes';
import { speakers } from './api/speakers';

export const api = { grammarPoints, sources, scenes, speakers };
