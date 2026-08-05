// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { StayWithCity } from '@/lib/mappers';
import { StayInfo } from './stay-info';

const stay: StayWithCity = {
  id: 'stay-1',
  cityId: 'city-1',
  name: 'Malá Strana townhouse',
  address: 'Malá Strana, Prague 1',
  historicNote: '17th-century burgher house below Prague Castle',
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

describe('StayInfo', () => {
  it('renders the name, historic note badge, and formatted rating', () => {
    render(<StayInfo stay={stay} />);
    expect(screen.getByText('Malá Strana townhouse')).toBeInTheDocument();
    expect(
      screen.getByText('17th-century burgher house below Prague Castle')
    ).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('composes the address line from address, city, and country', () => {
    render(<StayInfo stay={stay} />);
    expect(screen.getByText('Malá Strana, Prague 1, Prague, Czech Republic')).toBeInTheDocument();
  });

  it('rounds the rating to one decimal place', () => {
    render(<StayInfo stay={{ ...stay, rating: 4.666 }} />);
    expect(screen.getByText('4.7')).toBeInTheDocument();
  });
});
