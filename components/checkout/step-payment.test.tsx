// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StepPayment } from './step-payment';

describe('StepPayment', () => {
  it('renders all payment fields', () => {
    render(<StepPayment onBack={() => {}} onConfirm={() => {}} isSubmitting={false} />);
    expect(screen.getByLabelText('Name on card')).toBeInTheDocument();
    expect(screen.getByLabelText('Card number')).toBeInTheDocument();
    expect(screen.getByLabelText('Expiry')).toBeInTheDocument();
    expect(screen.getByLabelText('CVV')).toBeInTheDocument();
  });

  it('disables the confirm button until all fields are valid', () => {
    render(<StepPayment onBack={() => {}} onConfirm={() => {}} isSubmitting={false} />);
    expect(screen.getByText('Confirm booking')).toBeDisabled();
  });

  it('enables the confirm button once all fields hold valid values', () => {
    render(<StepPayment onBack={() => {}} onConfirm={() => {}} isSubmitting={false} />);
    fireEvent.change(screen.getByLabelText('Name on card'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '4111111111111111' },
    });
    fireEvent.change(screen.getByLabelText('Expiry'), { target: { value: '1299' } });
    fireEvent.change(screen.getByLabelText('CVV'), { target: { value: '123' } });
    expect(screen.getByText('Confirm booking')).not.toBeDisabled();
  });

  it('shows a field error after an invalid field is blurred', () => {
    render(<StepPayment onBack={() => {}} onConfirm={() => {}} isSubmitting={false} />);
    fireEvent.blur(screen.getByLabelText('Card number'));
    expect(screen.getByText('Enter a valid card number (13–19 digits).')).toBeInTheDocument();
  });

  it('calls onBack when the back button is clicked', () => {
    const handleBack = vi.fn();
    render(<StepPayment onBack={handleBack} onConfirm={() => {}} isSubmitting={false} />);
    fireEvent.click(screen.getByText('Back'));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});
