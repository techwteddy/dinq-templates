/**
 * Accessibility utilities for modal system
 */

/**
 * Traps focus within a given element.
 * @param element The element to trap focus within
 * @param event The keyboard event
 */
export function trapFocus(element: HTMLElement, event: KeyboardEvent) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        event.preventDefault();
      }
    }
  }
}

/**
 * Returns focus to a previously focused element.
 * @param element The element to return focus to
 */
export function returnFocus(element: HTMLElement | null) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Announces a message to screen readers using an ARIA live region.
 * @param message The message to announce
 * @param priority The priority of the announcement (polite or assertive)
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  if (typeof document === 'undefined') return;

  let announcer = document.getElementById('sr-announcer');

  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.margin = '-1px';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.borderWidth = '0';
    document.body.appendChild(announcer);
  } else {
    announcer.setAttribute('aria-live', priority);
  }

  // Clear and reset to trigger announcement
  announcer.textContent = '';
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 100);
}

/**
 * Handles common keyboard navigation patterns
 * @param event The keyboard event
 * @param callbacks Callbacks for specific keys
 */
export function handleKeyboardNavigation(
  event: KeyboardEvent,
  callbacks: {
    onEscape?: () => void;
    onEnter?: () => void;
    onTab?: (e: KeyboardEvent) => void;
  }
) {
  switch (event.key) {
    case 'Escape':
      if (callbacks.onEscape) {
        callbacks.onEscape();
        event.preventDefault();
      }
      break;
    case 'Enter':
      if (callbacks.onEnter) {
        callbacks.onEnter();
        event.preventDefault();
      }
      break;
    case 'Tab':
      if (callbacks.onTab) {
        callbacks.onTab(event);
      }
      break;
  }
}
