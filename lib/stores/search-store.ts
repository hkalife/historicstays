import { create } from 'zustand';
import type { StaySearchFilters } from '@/lib/api/stays';

type SearchState = {
  destination: string;
  checkIn: string | undefined;
  checkOut: string | undefined;
  guests: number;
  appliedFilters: StaySearchFilters;
  setDestination: (value: string) => void;
  setDateRange: (checkIn: string | undefined, checkOut: string | undefined) => void;
  setGuests: (value: number) => void;
  submitSearch: () => void;
};

export const useSearchStore = create<SearchState>((set, get) => ({
  destination: '',
  checkIn: undefined,
  checkOut: undefined,
  guests: 2,
  appliedFilters: {},
  setDestination: (destination) => set({ destination }),
  setDateRange: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (guests) => set({ guests }),
  submitSearch: () => {
    const { destination, checkIn, checkOut, guests } = get();
    set({
      appliedFilters: {
        query: destination || undefined,
        checkIn,
        checkOut,
        guests,
      },
    });
  },
}));
