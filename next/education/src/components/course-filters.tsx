'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CourseFiltersProps {
  categories: string[];
  levels: string[];
}

export function CourseFilters({ categories, levels }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else if (Array.isArray(value)) {
          newSearchParams.delete(key);
          value.forEach((v) => newSearchParams.append(key, v));
        } else {
          newSearchParams.set(key, value);
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string, checked: boolean) => {
    const currentValues = searchParams.getAll(key);
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }

    startTransition(() => {
      const queryString = createQueryString({
        [key]: newValues.length > 0 ? newValues : null,
        page: '1',
      });
      router.push(`/courses?${queryString}`);
    });
  };

  const handlePriceChange = (value: string) => {
    startTransition(() => {
      const queryString = createQueryString({
        price: value === 'all' ? null : value,
        page: '1',
      });
      router.push(`/courses?${queryString}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push('/courses');
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Price</h3>
        <Select
          value={searchParams.get('price') || 'all'}
          onValueChange={handlePriceChange}
        >
          <SelectTrigger aria-label="Filter by Price">
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="under-50">Under $50</SelectItem>
            <SelectItem value="50-100">$50 - $100</SelectItem>
            <SelectItem value="over-100">Over $100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-medium">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={searchParams.getAll('category').includes(category)}
                onCheckedChange={(checked) =>
                  handleFilterChange('category', category, checked as boolean)
                }
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-medium">Levels</h3>
        <div className="space-y-2">
          {levels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`level-${level}`}
                checked={searchParams.getAll('level').includes(level)}
                onCheckedChange={(checked) =>
                  handleFilterChange('level', level, checked as boolean)
                }
              />
              <Label
                htmlFor={`level-${level}`}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
        disabled={isPending}
      >
        Clear Filters
      </Button>
    </div>
  );
}
