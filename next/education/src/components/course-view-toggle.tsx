'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Icons } from '@/components/ui/Icons';
import { Button } from '@/components/ui/button';

export function CourseViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'grid';

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={currentView === 'grid' ? 'default' : 'outline'}
        size="icon"
        onClick={() => {
          router.push(`${pathname}?${createQueryString('view', 'grid')}`, {
            scroll: false,
          });
        }}
        title="Grid View"
      >
        <Icons.grid className="h-4 w-4" />
        <span className="sr-only">Grid View</span>
      </Button>
      <Button
        variant={currentView === 'list' ? 'default' : 'outline'}
        size="icon"
        onClick={() => {
          router.push(`${pathname}?${createQueryString('view', 'list')}`, {
            scroll: false,
          });
        }}
        title="List View"
      >
        <Icons.list className="h-4 w-4" />
        <span className="sr-only">List View</span>
      </Button>
    </div>
  );
}
