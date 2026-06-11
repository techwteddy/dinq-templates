import { expect, test, describe, afterEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { DemoModal } from '../components/DemoModal';
import { DemoProvider } from '../components/demo-provider';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';

afterEach(() => {
  cleanup();
});

describe('Edge Cases', () => {
  test('DemoModal handles various URL formats for external trigger', () => {
    const urls = [
      'https://twitter.com',
      'http://example.com',
      'https://github.com/someone/repo',
      'mailto:test@example.com',
      'tel:+123456789',
    ];

    urls.forEach((url) => {
      const { getByText } = render(
        <DemoProvider>
          <DemoModal
            isOpen={true}
            onClose={() => {}}
            triggerType="external"
            url={url}
          />
        </DemoProvider>
      );

      expect(
        getByText(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
      ).toBeTruthy();
      cleanup();
    });
  });

  test('Image fallback paths are correctly configured', () => {
    expect(PLACEHOLDER_IMAGES.courses.default).toContain('/images/courses/');
    expect(PLACEHOLDER_IMAGES.profiles.fallback.faculty).toContain(
      '/images/faculty/'
    );
  });
});
