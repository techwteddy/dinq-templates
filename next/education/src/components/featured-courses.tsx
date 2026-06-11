import { courses } from 'content';
import { CourseCard } from '@/components/course-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function FeaturedCourses() {
  const featuredCourses = courses.slice(0, 6);

  return (
    <section className="container py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-serif text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Featured Courses
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Explore our most popular courses and start learning today.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-5xl px-4 md:px-8">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {featuredCourses.map((course, index) => (
              <CarouselItem
                key={course.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <CourseCard course={course} priority={index === 0} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
