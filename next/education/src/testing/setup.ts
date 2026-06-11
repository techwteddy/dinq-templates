import { JSDOM } from 'jsdom';
import { afterEach, expect, mock } from 'bun:test';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import * as React from 'react';

// @ts-ignore
expect.extend(toHaveNoViolations);

// Mock Next.js components
mock.module('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', { ...props, src: props.src });
  },
}));

mock.module('next/link', () => ({
  default: (props: any) => {
    return React.createElement('a', { ...props, href: props.href });
  },
}));

mock.module('next/navigation', () => ({
  useRouter: () => ({
    push: mock(),
    replace: mock(),
    prefetch: mock(),
    back: mock(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
});

// @ts-ignore
globalThis.window = jsdom.window;
// @ts-ignore
globalThis.localStorage = jsdom.window.localStorage;
// @ts-ignore
globalThis.sessionStorage = jsdom.window.sessionStorage;
// @ts-ignore
globalThis.document = jsdom.window.document;
// @ts-ignore
globalThis.navigator = jsdom.window.navigator;
// @ts-ignore
globalThis.Node = jsdom.window.Node;
// @ts-ignore
globalThis.Element = jsdom.window.Element;
// @ts-ignore
globalThis.HTMLElement = jsdom.window.HTMLElement;
// @ts-ignore
globalThis.Node = jsdom.window.Node;

// Polyfills for React 17/18 compatibility in JSDOM
if (globalThis.Element && globalThis.Element.prototype) {
  (globalThis.Element.prototype as any).attachEvent =
    (globalThis.Element.prototype as any).attachEvent || (() => {});
  (globalThis.Element.prototype as any).detachEvent =
    (globalThis.Element.prototype as any).detachEvent || (() => {});
}

// @ts-ignore
globalThis.DocumentFragment = jsdom.window.DocumentFragment;
// @ts-ignore
globalThis.SVGElement = jsdom.window.SVGElement;
// @ts-ignore
globalThis.ShadowRoot = jsdom.window.ShadowRoot;
// @ts-ignore
globalThis.MutationObserver = jsdom.window.MutationObserver;
// @ts-ignore
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
// @ts-ignore
globalThis.HTMLAnchorElement = jsdom.window.HTMLAnchorElement;
// @ts-ignore
globalThis.HTMLButtonElement = jsdom.window.HTMLButtonElement;
// @ts-ignore
globalThis.HTMLInputElement = jsdom.window.HTMLInputElement;
// @ts-ignore
globalThis.HTMLTextAreaElement = jsdom.window.HTMLTextAreaElement;
// @ts-ignore
globalThis.HTMLSelectElement = jsdom.window.HTMLSelectElement;
// @ts-ignore
globalThis.HTMLFormElement = jsdom.window.HTMLFormElement;
// @ts-ignore
globalThis.CustomEvent = jsdom.window.CustomEvent;
// @ts-ignore
globalThis.Event = jsdom.window.Event;
// @ts-ignore
globalThis.MouseEvent = jsdom.window.MouseEvent;
// @ts-ignore
globalThis.KeyboardEvent = jsdom.window.KeyboardEvent;
// @ts-ignore
globalThis.FocusEvent = jsdom.window.FocusEvent;
// @ts-ignore
globalThis.PointerEvent = jsdom.window.PointerEvent;
// @ts-ignore
globalThis.WheelEvent = jsdom.window.WheelEvent;
// @ts-ignore
globalThis.NodeFilter = jsdom.window.NodeFilter;
// @ts-ignore
globalThis.getComputedStyle = jsdom.window.getComputedStyle;
// @ts-ignore
globalThis.requestAnimationFrame = (cb: FrameRequestCallback) =>
  setTimeout(cb, 0);
// @ts-ignore
globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);

afterEach(() => {
  cleanup();
});
