// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stepper } from './stepper';

describe('Stepper', () => {
  const labels: [string, string, string] = ['Your trip', 'Your details', 'Payment'];

  it('shows the step number (not a checkmark) for the active step', () => {
    render(<Stepper current={1} labels={labels} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders a checkmark instead of the digit for completed steps', () => {
    const { container } = render(<Stepper current={3} labels={labels} />);
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(container.querySelectorAll('svg.lucide-check')).toHaveLength(2);
  });

  it('renders all step labels', () => {
    render(<Stepper current={2} labels={labels} />);
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
