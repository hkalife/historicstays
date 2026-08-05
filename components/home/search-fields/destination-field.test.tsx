// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useSearchStore } from '@/lib/stores/search-store';
import { DestinationField } from './destination-field';

describe('DestinationField', () => {
  afterEach(() => {
    useSearchStore.setState({ destination: '', appliedFilters: {} });
  });

  it('renders the current destination value', () => {
    useSearchStore.setState({ destination: 'Prague' });
    render(<DestinationField />);
    expect(screen.getByLabelText('Destination')).toHaveValue('Prague');
  });

  it('updates the store as the user types', () => {
    render(<DestinationField />);
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'Munich' } });
    expect(useSearchStore.getState().destination).toBe('Munich');
  });

  it('clears the destination and re-applies the search when the clear button is clicked', () => {
    useSearchStore.setState({ destination: 'Prague' });
    useSearchStore.getState().submitSearch();
    expect(useSearchStore.getState().appliedFilters.query).toBe('Prague');

    render(<DestinationField />);
    fireEvent.click(screen.getByLabelText('Clear destination'));

    expect(useSearchStore.getState().destination).toBe('');
    expect(useSearchStore.getState().appliedFilters.query).toBeUndefined();
  });
});
