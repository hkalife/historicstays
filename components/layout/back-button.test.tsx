// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BackButton } from './back-button';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

const pushMock = vi.fn();
const backMock = vi.fn();

beforeEach(() => {
  pushMock.mockClear();
  backMock.mockClear();
  vi.mocked(useRouter).mockReturnValue({ push: pushMock, back: backMock } as never);
});

describe('BackButton', () => {
  it('calls router.back() when no href is given', () => {
    render(<BackButton />);
    fireEvent.click(screen.getByText('Back'));
    expect(backMock).toHaveBeenCalledTimes(1);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('navigates to the given href instead of going back when href is provided', () => {
    render(<BackButton href="/" />);
    fireEvent.click(screen.getByText('Back'));
    expect(pushMock).toHaveBeenCalledWith('/');
    expect(backMock).not.toHaveBeenCalled();
  });
});
