import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { buttonVariants } from '@/components/ui/button';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Features } from '@/components/features';
import { FeaturedCourses } from '@/components/featured-courses';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-8">
      <section className="relative h-[600px] w-full overflow-hidden">
        <Image
          src={PLACEHOLDER_IMAGES.hero.home}
          alt="Education Platform Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative flex h-full flex-col items-center justify-center gap-4 text-center text-white">
          <Link
            href={siteConfig.links.twitter}
            className="rounded-2xl bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
            target="_blank"
          >
            Follow along on Twitter
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>
          <p className="max-w-[42rem] leading-normal text-slate-200 sm:text-xl sm:leading-8">
            {siteConfig.description}
          </p>
          <div className="mt-4 space-x-4">
            <Link
              href="/courses"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'transition-transform hover:scale-105'
              )}
            >
              Get Started
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-white/20 bg-white/10 text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/20'
              )}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
      <FeaturedCourses />
      <Features />
    </div>
  );
}
