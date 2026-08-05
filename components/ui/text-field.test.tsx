// @vitest-environment jsdom
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TextField } from './text-field';

describe('TextField', () => {
  it('renders the label and current value', () => {
    render(
      <TextField id="name" label="Full name" value="Jane" onChange={() => {}} maxLength={50} />
    );
    expect(screen.getByLabelText('Full name')).toHaveValue('Jane');
  });

  it('strips angle brackets from typed input before calling onChange', () => {
    const handleChange = vi.fn();
    render(
      <TextField id="name" label="Full name" value="" onChange={handleChange} maxLength={50} />
    );
    fireEvent.change(screen.getByLabelText('Full name'), {
      target: { value: '<script>Bob</script>' },
    });
    expect(handleChange).toHaveBeenCalledWith('scriptBob/script');
  });

  it('applies the maxLength attribute', () => {
    render(<TextField id="name" label="Full name" value="" onChange={() => {}} maxLength={12} />);
    expect(screen.getByLabelText('Full name')).toHaveAttribute('maxlength', '12');
  });

  it('shows the error message and marks the field as invalid', () => {
    render(
      <TextField
        id="email"
        label="Email"
        value=""
        onChange={() => {}}
        maxLength={50}
        error="Enter a valid email"
      />
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });

  it('shows the hint instead of an error when there is no error', () => {
    render(
      <TextField
        id="email"
        label="Email"
        value=""
        onChange={() => {}}
        maxLength={50}
        hint="We'll send your confirmation here."
      />
    );
    expect(screen.getByText("We'll send your confirmation here.")).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false');
  });
});
