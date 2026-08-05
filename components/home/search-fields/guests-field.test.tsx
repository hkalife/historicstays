// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useSearchStore } from '@/lib/stores/search-store';
import { GuestsField } from './guests-field';

describe('GuestsField', () => {
  afterEach(() => {
    useSearchStore.setState({ guests: 2 });
  });

  it('shows the current guest count', () => {
    render(<GuestsField />);
    expect(screen.getByText('2 guests')).toBeInTheDocument();
  });

  it('increments the guest count when the picker is opened and + is clicked', () => {
    render(<GuestsField />);
    fireEvent.click(screen.getByText('2 guests'));
    fireEvent.click(screen.getByLabelText('Increase number of guests'));
    expect(useSearchStore.getState().guests).toBe(3);
  });

  it('disables the decrease button at the minimum of 1 guest', () => {
    useSearchStore.setState({ guests: 1 });
    render(<GuestsField />);
    fireEvent.click(screen.getByText('1 guest'));
    expect(screen.getByLabelText('Decrease number of guests')).toBeDisabled();
  });
});
