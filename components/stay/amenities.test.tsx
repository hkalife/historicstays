// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Amenities } from './amenities';

describe('Amenities', () => {
  it('renders the title and each known amenity with its translated label', () => {
    render(<Amenities amenities={['wifi', 'kitchen']} locale="en" title="Amenities" />);
    expect(screen.getByText('Amenities')).toBeInTheDocument();
    expect(screen.getByText('Wifi')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
  });

  it('translates labels according to the given locale', () => {
    render(<Amenities amenities={['kitchen']} locale="pt" title="Comodidades" />);
    expect(screen.getByText('Cozinha')).toBeInTheDocument();
  });

  it('silently skips an amenity with no matching metadata', () => {
    render(<Amenities amenities={['wifi', 'unknown-amenity']} locale="en" title="Amenities" />);
    expect(screen.getByText('Wifi')).toBeInTheDocument();
    expect(screen.queryByText('unknown-amenity')).not.toBeInTheDocument();
  });
});
