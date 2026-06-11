import { expect, test, describe, afterEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { MainNav } from '../components/main-nav';
import { SiteHeader } from '../components/site-header';
import { DemoProvider } from '../components/demo-provider';
import { AuthProvider } from '../context/AuthContext';

describe('Navigation Links', () => {
  afterEach(() => {
    cleanup();
  });

  test('MainNav contains essential links', () => {
    const { getByText } = render(
      <AuthProvider>
        <DemoProvider>
          <MainNav />
        </DemoProvider>
      </AuthProvider>
    );

    expect(getByText(/Courses/i)).toBeTruthy();
    expect(getByText(/Faculty/i)).toBeTruthy();
    expect(getByText(/Blog/i)).toBeTruthy();
    expect(getByText(/About/i)).toBeTruthy();
    expect(getByText(/Contact/i)).toBeTruthy();
  });

  test('SiteHeader contains Login link', () => {
    const { getByText } = render(
      <AuthProvider>
        <DemoProvider>
          <SiteHeader />
        </DemoProvider>
      </AuthProvider>
    );

    expect(getByText(/Login/i)).toBeTruthy();
  });

  test('Links have correct href attributes', () => {
    const { getByText } = render(
      <AuthProvider>
        <DemoProvider>
          <MainNav />
        </DemoProvider>
      </AuthProvider>
    );

    expect(
      getByText(/Courses/i)
        .closest('a')
        ?.getAttribute('href')
    ).toBe('/courses');
    expect(
      getByText(/Faculty/i)
        .closest('a')
        ?.getAttribute('href')
    ).toBe('/faculty');
    expect(getByText(/Blog/i).closest('a')?.getAttribute('href')).toBe('/blog');
    expect(getByText(/About/i).closest('a')?.getAttribute('href')).toBe(
      '/about'
    );
    expect(
      getByText(/Contact/i)
        .closest('a')
        ?.getAttribute('href')
    ).toBe('/contact');
  });
});
