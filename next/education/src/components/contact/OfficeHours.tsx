import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function OfficeHours() {
  const departments = [
    { name: 'Admissions', hours: 'Mon-Fri: 8am - 6pm' },
    { name: 'Financial Aid', hours: 'Mon-Fri: 9am - 4pm' },
    { name: 'IT Help Desk', hours: '24/7 (Mon-Sun)' },
    { name: 'Academic Advising', hours: 'Mon-Thu: 9am - 5pm, Fri: 9am - 12pm' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Clock className="h-6 w-6" />
        </div>
        <CardTitle>Office Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.map((dept) => (
            <div
              key={dept.name}
              className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
            >
              <span className="font-medium">{dept.name}</span>
              <span className="text-sm text-muted-foreground">
                {dept.hours}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs italic text-muted-foreground">
          * All times are in Eastern Standard Time (EST). Closed on federal
          holidays.
        </p>
      </CardContent>
    </Card>
  );
}
