import {
  AlarmClock,
  Handshake,
  Headphones,
  MapPin,
  Mountain,
  TreePine,
  Umbrella,
  Users,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  mountain: Mountain,
  umbrella: Umbrella,
  'tree-pine': TreePine,
  'map-pin': MapPin,
  headphones: Headphones,
  'alarm-clock': AlarmClock,
  handshake: Handshake,
  users: Users,
};

const DEFAULT_HERO_ICON = Mountain;
const DEFAULT_PROMISE_ICON = Headphones;

export function resolveHeroChipIcon(key: string): LucideIcon {
  return ICON_MAP[key] ?? DEFAULT_HERO_ICON;
}

export function resolvePromiseIcon(key: string): LucideIcon {
  return ICON_MAP[key] ?? DEFAULT_PROMISE_ICON;
}
