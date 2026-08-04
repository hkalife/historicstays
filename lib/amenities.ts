import {
  AirVent,
  DoorOpen,
  Flame,
  Sofa,
  UtensilsCrossed,
  WashingMachine,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import type { Locale } from './i18n/dictionaries';

export const AMENITY_META: Record<string, { icon: LucideIcon; label: Record<Locale, string> }> = {
  wifi: {
    icon: Wifi,
    label: { en: 'Wifi', pt: 'Wifi', es: 'Wifi' },
  },
  kitchen: {
    icon: UtensilsCrossed,
    label: { en: 'Kitchen', pt: 'Cozinha', es: 'Cocina' },
  },
  heating: {
    icon: Flame,
    label: { en: 'Heating', pt: 'Aquecimento', es: 'Calefacción' },
  },
  washer: {
    icon: WashingMachine,
    label: { en: 'Washer', pt: 'Máquina de lavar', es: 'Lavadora' },
  },
  balcony: {
    icon: DoorOpen,
    label: { en: 'Balcony', pt: 'Varanda', es: 'Balcón' },
  },
  'air conditioning': {
    icon: AirVent,
    label: { en: 'Air conditioning', pt: 'Ar-condicionado', es: 'Aire acondicionado' },
  },
  'shared lounge': {
    icon: Sofa,
    label: { en: 'Shared lounge', pt: 'Sala compartilhada', es: 'Sala compartida' },
  },
};
