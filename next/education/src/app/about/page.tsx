import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { siteConfig } from '@/config/site';
import { Icons } from '@/components/ui/Icons';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn, getAssetPath } from '@/lib/utils';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn more about ${siteConfig.name} and our mission to provide quality education.`,
};

const values = [
  {
    title: 'Academic Excellence',
    description:
      'We strive for the highest standards in teaching and learning, ensuring our students receive a top-tier education.',
    icon: 'trophy',
  },
  {
    title: 'Innovation',
    description:
      'We embrace new technologies and teaching methodologies to keep our curriculum relevant and engaging.',
    icon: 'lightbulb',
  },
  {
    title: 'Inclusivity',
    description:
      'We believe education should be accessible to everyone, regardless of their background or location.',
    icon: 'handshake',
  },
  {
    title: 'Community',
    description:
      'We foster a supportive environment where students can collaborate, share ideas, and grow together.',
    icon: 'usersRound',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      <section className="relative h-[400px] w-full overflow-hidden lg:h-[500px]">
        <Image
          src={PLACEHOLDER_IMAGES.hero.about}
          alt="About Our Platform"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative flex h-full flex-col items-center justify-center gap-4 text-center text-white">
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Empowering the Next Generation of Learners
          </h1>
          <p className="max-w-[42rem] leading-normal text-slate-200 sm:text-xl sm:leading-8">
            Learn more about {siteConfig.name} and our mission to provide
            quality education to everyone, everywhere.
          </p>
        </div>
      </section>

      <div className="container space-y-16 lg:space-y-24">
        <section className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="font-serif text-2xl md:text-4xl">Our Mission</h2>
            <p className="text-muted-foreground sm:text-lg">
              To provide a comprehensive, flexible, and engaging learning
              platform that empowers individuals to achieve their professional
              and personal goals through expert-led courses and a supportive
              community. We believe that education is the most powerful tool for
              personal growth and social change.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image
              src={getAssetPath('/images/courses/course-bus350.jpg')}
              alt="Our Library"
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-xl md:order-last">
            <Image
              src={getAssetPath('/images/courses/course-edu101.jpg')}
              alt="Our Classroom"
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="font-serif text-2xl md:text-4xl">Our Vision</h2>
            <p className="text-muted-foreground sm:text-lg">
              We envision a world where high-quality education is just a click
              away for everyone. By leveraging technology and collaborating with
              industry experts, we aim to bridge the skills gap and create a
              more equitable future for learners around the globe.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-serif text-2xl md:text-4xl">Our Core Values</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg">
              These principles guide everything we do, from course development
              to student support.
            </p>
          </div>
          <div className="mx-auto mt-8 grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem]">
            {values.map((value) => {
              const Icon = Icons[value.icon as keyof typeof Icons];
              return (
                <Card
                  key={value.title}
                  className="flex flex-col justify-between transition-all hover:shadow-md"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-serif">{value.title}</CardTitle>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col items-center space-y-4 pb-12 text-center">
          <h2 className="font-serif text-2xl md:text-4xl">
            Join Our Community
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg">
            Ready to start your learning journey? Explore our courses and find
            the perfect fit for you.
          </p>
          <div className="flex gap-4">
            <Link
              href="/courses"
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Browse Courses
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
