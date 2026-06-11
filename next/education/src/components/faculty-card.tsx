'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Instructor } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icons } from '@/components/ui/Icons';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-images';
import { getAssetPath } from '@/lib/utils';

interface FacultyCardProps {
  instructor: Instructor;
}

export function FacultyCard({ instructor }: FacultyCardProps) {
  const [imgSrc, setImgSrc] = useState(getAssetPath(instructor.image));

  const getSocialLink = (platform: string, value: string) => {
    if (value.startsWith('http')) return value;
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/${value.replace('@', '')}`;
      case 'github':
        return `https://github.com/${value}`;
      case 'linkedin':
        return `https://linkedin.com/in/${value}`;
      default:
        return value;
    }
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pt-8">
        <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full border-4 border-background shadow-xl transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-2xl">
          <Image
            src={imgSrc}
            alt={instructor.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="192px"
            onError={() =>
              setImgSrc(PLACEHOLDER_IMAGES.profiles.fallback.faculty)
            }
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="px-4 text-center text-xs font-bold uppercase tracking-widest text-white">
              {instructor.department}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-center">
        <h3 className="mb-1 font-serif text-xl font-bold">{instructor.name}</h3>
        <p className="mb-4 text-sm font-medium text-primary">
          {instructor.role}
        </p>
        <p className="mb-6 line-clamp-3 text-sm text-muted-foreground">
          {instructor.bio}
        </p>
        <div className="flex justify-center space-x-4">
          {instructor.socials?.twitter && (
            <a
              href={getSocialLink('twitter', instructor.socials.twitter)}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Icons.twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
          )}
          {instructor.socials?.github && (
            <a
              href={getSocialLink('github', instructor.socials.github)}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Icons.gitHub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          )}
          {instructor.socials?.linkedin && (
            <a
              href={getSocialLink('linkedin', instructor.socials.linkedin)}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Icons.linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          )}
          {instructor.socials?.website && (
            <a
              href={getSocialLink('website', instructor.socials.website)}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Icons.globe className="h-5 w-5" />
              <span className="sr-only">Website</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
