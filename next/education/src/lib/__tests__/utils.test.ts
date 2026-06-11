import { expect, test, describe } from 'bun:test';
import { cn } from '../utils';

describe('cn', () => {
  test('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-2', 'px-4')).toBe('py-2 px-4');
  });

  test('handles conditional classes', () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn('px-2', isTrue && 'py-2', isFalse && 'm-2')).toBe('px-2 py-2');
  });

  test('handles undefined and null', () => {
    expect(cn('px-2', undefined, null)).toBe('px-2');
  });

  test('handles arrays of classes', () => {
    expect(cn(['px-2', 'py-2'], 'm-2')).toBe('px-2 py-2 m-2');
  });
});
