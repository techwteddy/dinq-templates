import { expect, test, describe } from 'bun:test';
import {
  calculateHeight,
  generateSrcSet,
  getDefaultSizes,
} from '../image-optimizer';

describe('image-optimizer', () => {
  describe('calculateHeight', () => {
    test('calculates height for video aspect ratio (16:9)', () => {
      expect(calculateHeight(1600, 'video')).toBe(900);
    });

    test('calculates height for square aspect ratio (1:1)', () => {
      expect(calculateHeight(1000, 'square')).toBe(1000);
    });

    test('calculates height for numeric aspect ratio', () => {
      expect(calculateHeight(1200, 1.5)).toBe(800);
    });
  });

  describe('generateSrcSet', () => {
    test('generates correct srcset string', () => {
      const images = {
        thumbnail: '/img-400.webp',
        small: '/img-800.webp',
        medium: '/img-1200.webp',
        large: '/img-1920.webp',
      };
      const srcset = generateSrcSet(images);
      expect(srcset).toContain('/img-400.webp 400w');
      expect(srcset).toContain('/img-800.webp 800w');
      expect(srcset).toContain('/img-1200.webp 1200w');
      expect(srcset).toContain('/img-1920.webp 1920w');
    });
  });

  describe('getDefaultSizes', () => {
    test('returns full width default', () => {
      expect(getDefaultSizes()).toBe('100vw');
    });

    test('returns half width sizes', () => {
      expect(getDefaultSizes('half')).toBe('(max-width: 768px) 100vw, 50vw');
    });

    test('returns third width sizes', () => {
      expect(getDefaultSizes('third')).toBe(
        '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      );
    });
  });
});
