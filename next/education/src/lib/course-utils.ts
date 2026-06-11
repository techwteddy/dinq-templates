import { Course } from '@/types';

export interface FilterOptions {
  category?: string | string[];
  level?: string | string[];
  price?: string;
}

export function filterCourses(
  courses: Course[],
  options: FilterOptions
): Course[] {
  let filteredCourses = courses.filter((course) => course.published !== false);

  const selectedCategories = options.category
    ? Array.isArray(options.category)
      ? options.category
      : [options.category]
    : [];

  const selectedLevels = options.level
    ? Array.isArray(options.level)
      ? options.level
      : [options.level]
    : [];

  if (selectedCategories.length > 0) {
    filteredCourses = filteredCourses.filter((course) =>
      selectedCategories.includes(course.category)
    );
  }

  if (selectedLevels.length > 0) {
    filteredCourses = filteredCourses.filter((course) =>
      selectedLevels.includes(course.level)
    );
  }

  if (options.price) {
    filteredCourses = filteredCourses.filter((course) => {
      if (options.price === 'free') return course.price === 0;
      if (options.price === 'under-50') return course.price < 50;
      if (options.price === '50-100')
        return course.price >= 50 && course.price <= 100;
      if (options.price === 'over-100') return course.price > 100;
      return true;
    });
  }

  return filteredCourses;
}

export function paginateCourses<T>(
  items: T[],
  page: number,
  pageSize: number
): T[] {
  return items.slice((page - 1) * pageSize, page * pageSize);
}
