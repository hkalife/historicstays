import { describe, expect, it } from 'vitest';
import { sanitizeText } from './sanitize';

describe('sanitizeText', () => {
  it('strips angle brackets so tags cannot be formed', () => {
    expect(sanitizeText('<script>alert(1)</script>Bob')).toBe('scriptalert(1)/scriptBob');
  });

  it('leaves normal text untouched', () => {
    expect(sanitizeText('Great stay, 5/5 would book again!')).toBe(
      'Great stay, 5/5 would book again!'
    );
  });

  it('strips only angle brackets, keeping other punctuation', () => {
    expect(sanitizeText("O'Brien <b>loves</b> this place — 10/10")).toBe(
      "O'Brien bloves/b this place — 10/10"
    );
  });
});
