// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { StayWithCity } from '@/lib/mappers';
import { useStaysQuery } from '@/lib/queries/use-stays';
import { SearchResults } from './search-results';

vi.mock('@/lib/queries/use-stays', () => ({
  useStaysQuery: vi.fn(),
}));

const mockedUseStaysQuery = vi.mocked(useStaysQuery);

const stay: StayWithCity = {
  id: 'stay-1',
  cityId: 'city-1',
  name: 'Malá Strana townhouse',
  address: 'Malá Strana, Prague 1',
  historicNote: '17th-century burgher house',
  description: 'A restored townhouse.',
  pricePerNight: 142,
  maxGuests: 4,
  rating: 4.8,
  amenities: ['wifi'],
  images: ['/a.png'],
  blockedDates: [],
  cityName: 'Prague',
  country: 'Czech Republic',
};

describe('SearchResults', () => {
  it('shows a spinner while loading', () => {
    mockedUseStaysQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as never);
    const { container } = render(<SearchResults />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows an error message when the query fails', () => {
    mockedUseStaysQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as never);
    render(<SearchResults />);
    expect(
      screen.getByText('Something went wrong loading stays. Please try again.')
    ).toBeInTheDocument();
  });

  it('shows an empty message when there are no results', () => {
    mockedUseStaysQuery.mockReturnValue({
      data: { stays: [] },
      isLoading: false,
      isError: false,
    } as never);
    render(<SearchResults />);
    expect(
      screen.getByText('No stays match your search. Try different dates or filters.')
    ).toBeInTheDocument();
  });

  it('renders a card for each returned stay', () => {
    mockedUseStaysQuery.mockReturnValue({
      data: { stays: [stay] },
      isLoading: false,
      isError: false,
    } as never);
    render(<SearchResults />);
    expect(screen.getByText('Malá Strana townhouse')).toBeInTheDocument();
  });
});
