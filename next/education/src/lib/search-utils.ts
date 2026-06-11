import { Course, Post, Author } from 'content';

/**
 * Filters courses for the search menu.
 * Ensures security by hiding unpublished content.
 */
export function getFilteredCourses(courses: Course[]) {
  return courses.filter((course) => course.published !== false);
}

/**
 * Filters posts for the search menu.
 * Ensures security by hiding unpublished content.
 */
export function getFilteredPosts(posts: Post[]) {
  return posts.filter((post) => post.published !== false);
}

/**
 * Filters authors for the search menu.
 */
export function getFilteredAuthors(authors: Author[]) {
  return authors;
}
