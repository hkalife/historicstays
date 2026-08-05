// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useSessionStore } from '@/lib/stores/session-store';
import { AuthButtons } from './auth-buttons';

describe('AuthButtons', () => {
  afterEach(() => {
    useSessionStore.getState().clearUser();
  });

  it('shows Register and Login links when logged out', () => {
    render(<AuthButtons />);
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('shows a greeting, My bookings, and Log out when logged in', () => {
    useSessionStore.getState().setUser({ id: 'u1', name: 'Henrique', email: 'h@example.com' });
    render(<AuthButtons />);
    expect(screen.getByText('Hi, Henrique')).toBeInTheDocument();
    expect(screen.getByText('My bookings')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('clears the session when Log out is clicked', () => {
    useSessionStore.getState().setUser({ id: 'u1', name: 'Henrique', email: 'h@example.com' });
    render(<AuthButtons />);
    fireEvent.click(screen.getByText('Log out'));
    expect(useSessionStore.getState().user).toBeNull();
  });
});
