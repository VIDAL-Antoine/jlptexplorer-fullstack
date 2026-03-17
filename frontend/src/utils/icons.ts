import {
  IconDeviceGamepad2,
  IconDeviceTv,
  IconMovie,
  IconMusic,
  IconTag,
} from '@tabler/icons-react';
import { type Source } from '../lib/api';

export type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

const SOURCE_TYPE_ICONS: Partial<Record<Source['type'], IconComponent>> = {
  game: IconDeviceGamepad2,
  anime: IconDeviceTv,
  series: IconDeviceTv,
  movie: IconMovie,
  music: IconMusic,
};

export function getSourceTypeIcon(type: Source['type']): IconComponent {
  return SOURCE_TYPE_ICONS[type] ?? IconTag;
}
