import {
  expect,
  test,
  describe,
  spyOn,
  beforeEach,
  afterEach,
  mock,
} from 'bun:test';
import {
  trapFocus,
  returnFocus,
  announceToScreenReader,
  handleKeyboardNavigation,
} from '../a11y-modal-utils';

describe('a11y-modal-utils', () => {
  describe('trapFocus', () => {
    let container: HTMLElement;
    let firstBtn: HTMLButtonElement;
    let lastBtn: HTMLButtonElement;

    beforeEach(() => {
      container = document.createElement('div');
      firstBtn = document.createElement('button');
      lastBtn = document.createElement('button');
      container.appendChild(firstBtn);
      container.appendChild(lastBtn);
      document.body.appendChild(container);
    });

    afterEach(() => {
      if (container.parentElement) {
        document.body.removeChild(container);
      }
    });

    test('should focus first element when tabbing forward from last element', () => {
      lastBtn.focus();
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      trapFocus(container, event);

      expect(document.activeElement).toBe(firstBtn);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('should focus last element when tabbing backward from first element', () => {
      firstBtn.focus();
      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
      });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      trapFocus(container, event);

      expect(document.activeElement).toBe(lastBtn);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('returnFocus', () => {
    test('should call focus on the provided element', () => {
      const btn = document.createElement('button');
      const focusSpy = spyOn(btn, 'focus');

      returnFocus(btn);

      expect(focusSpy).toHaveBeenCalled();
    });

    test('should not throw when element is null', () => {
      expect(() => returnFocus(null)).not.toThrow();
    });
  });

  describe('announceToScreenReader', () => {
    afterEach(() => {
      const announcer = document.getElementById('sr-announcer');
      if (announcer) {
        document.body.removeChild(announcer);
      }
    });

    test('should create an announcer element and set text', (done) => {
      announceToScreenReader('Test message');

      setTimeout(() => {
        const announcer = document.getElementById('sr-announcer');
        expect(announcer).toBeTruthy();
        expect(announcer?.textContent).toBe('Test message');
        done();
      }, 200);
    });
  });

  describe('handleKeyboardNavigation', () => {
    test('should call onEscape when Escape key is pressed', () => {
      const onEscape = mock(() => {});
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      // @ts-ignore
      spyOn(event, 'preventDefault').mockImplementation(() => {});

      handleKeyboardNavigation(event, { onEscape });

      expect(onEscape).toHaveBeenCalled();
    });

    test('should call onEnter when Enter key is pressed', () => {
      const onEnter = mock(() => {});
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      // @ts-ignore
      spyOn(event, 'preventDefault').mockImplementation(() => {});

      handleKeyboardNavigation(event, { onEnter });

      expect(onEnter).toHaveBeenCalled();
    });
  });
});
