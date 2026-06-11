import { test, expect } from '@playwright/test';

test.describe('Critical User Journeys', () => {
  test('Visitor can find a course and enroll', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Education Website Template/);

    // 2. Click "Get Started"
    await page.getByRole('link', { name: 'Get Started' }).click();
    await expect(page).toHaveURL(/\/courses/);
    await expect(
      page.getByRole('heading', { name: 'Courses', exact: true })
    ).toBeVisible();

    // 3. Click "View Course" on the first course card
    // We wait for the cards to be visible
    const firstCourseCard = page
      .locator('article, .border')
      .filter({ hasText: 'View Course' })
      .first();
    await firstCourseCard.getByRole('link', { name: 'View Course' }).click();

    // 4. Verify we are on the course details page
    await expect(page).toHaveURL(/\/courses\/.+/);
    await expect(
      page.getByRole('button', { name: 'Enroll Now' })
    ).toBeVisible();

    // 5. Click "Enroll Now" to open the modal
    await page.getByRole('button', { name: 'Enroll Now' }).click();
    await expect(
      page.getByText(
        'Please provide your details to start the enrollment process'
      )
    ).toBeVisible();

    // 6. Fill in enrollment details
    const enrollmentModal = page.getByRole('dialog');
    await enrollmentModal.getByLabel('Name').fill('Test User');
    await enrollmentModal.getByLabel('Email').fill('test@example.com');

    // 7. Proceed to payment
    await enrollmentModal
      .getByRole('button', { name: 'Proceed to Payment' })
      .click();

    // 8. Verify loading state
    await expect(enrollmentModal.getByText('Processing Payment')).toBeVisible();

    // 9. Verify success message (Wait for simulation)
    await expect(
      enrollmentModal.getByText('Enrollment Successful!', { exact: true })
    ).toBeVisible({ timeout: 5000 });
    await expect(enrollmentModal.getByText(/Welcome to/)).toBeVisible();

    // 10. Close modal
    await enrollmentModal.getByRole('button', { name: 'Go to Course' }).click();
    await expect(enrollmentModal).not.toBeVisible();
  });

  test('Visitor can fill and submit the contact form', async ({ page }) => {
    // 1. Go to contact page
    await page.goto('/contact');
    await expect(
      page.getByRole('heading', { name: 'Contact Us', exact: true })
    ).toBeVisible();

    // 2. Fill in the form
    const contactForm = page
      .locator('form')
      .filter({ hasText: 'Send Message' });
    await contactForm.getByLabel('Name').fill('John Doe');
    await contactForm.getByLabel('Email').fill('john@example.com');
    await contactForm.getByLabel('Subject').fill('Test Inquiry');
    await contactForm
      .getByLabel('Message')
      .fill('This is a test message for the contact form journey.');

    // 3. Submit the form
    await contactForm.getByRole('button', { name: 'Send Message' }).click();

    // 4. Verify success (toast)
    // Shadcn toast might be hard to target by role, let's use text
    await expect(page.getByText('Message sent!').first()).toBeVisible();
    await expect(
      page.getByText('We will get back to you as soon as possible.').first()
    ).toBeVisible();

    // 5. Verify form is reset
    await expect(contactForm.getByLabel('Name')).toHaveValue('');
  });
});
