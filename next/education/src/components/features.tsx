import { Icons } from '@/components/ui/Icons';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    title: 'Expert Instructors',
    description:
      'Learn from industry professionals with years of experience in their respective fields.',
    icon: 'userCheck',
  },
  {
    title: 'Flexible Learning',
    description:
      'Study at your own pace with lifetime access to all course materials and resources.',
    icon: 'calendarClock',
  },
  {
    title: 'Recognized Certificates',
    description:
      'Earn certificates that are recognized by top employers and institutions worldwide.',
    icon: 'fileBadge',
  },
  {
    title: 'Global Community',
    description:
      'Connect with students from all over the world and share your learning journey.',
    icon: 'globe2',
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="container space-y-6 py-8 md:py-12 lg:py-24"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-serif text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Why Choose Us
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          We provide a comprehensive learning experience designed to help you
          succeed in your career and beyond.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2">
        {features.map((feature) => {
          const Icon = Icons[feature.icon as keyof typeof Icons];
          return (
            <Card key={feature.title} className="flex flex-col justify-between">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
