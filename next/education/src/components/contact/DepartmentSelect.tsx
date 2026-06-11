'use client';

import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const DEPARTMENTS = [
  {
    id: 'admissions',
    name: 'Admissions',
    subcategories: [
      'Undergraduate',
      'Graduate',
      'International',
      'Financial Aid Inquiry',
    ],
  },
  {
    id: 'academic-advising',
    name: 'Academic Advising',
    subcategories: [
      'Course Registration',
      'Degree Planning',
      'Transfer Credits',
      'Academic Probation',
    ],
  },
  {
    id: 'financial-aid',
    name: 'Financial Aid',
    subcategories: [
      'Scholarships',
      'Grants',
      'Loans',
      'Work-Study',
      'FAFSA Support',
    ],
  },
  {
    id: 'student-services',
    name: 'Student Services',
    subcategories: [
      'Housing',
      'Career Services',
      'Health & Wellness',
      'Disability Services',
    ],
  },
  {
    id: 'it-help-desk',
    name: 'IT Help Desk',
    subcategories: [
      'Login Issues',
      'Software Access',
      'Hardware Repair',
      'Canvas Support',
    ],
  },
  {
    id: 'general',
    name: 'General Inquiry',
    subcategories: [
      'Media Relations',
      'Campus Tours',
      'Alumni Relations',
      'Other',
    ],
  },
] as const;

interface DepartmentSelectProps {
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  name?: string;
}

export function DepartmentSelect({
  onValueChange,
  defaultValue,
  value,
  disabled,
  name,
}: DepartmentSelectProps) {
  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      value={value}
      disabled={disabled}
      name={name}
    >
      <SelectTrigger
        className="w-full"
        aria-label="Select Department"
        id="department-select"
      >
        <SelectValue placeholder="Select a department" />
      </SelectTrigger>
      <SelectContent>
        {DEPARTMENTS.map((dept) => (
          <SelectGroup key={dept.id}>
            <SelectLabel className="mt-2 first:mt-0">{dept.name}</SelectLabel>
            {dept.subcategories.map((sub) => (
              <SelectItem
                key={`${dept.id}-${sub}`}
                value={`${dept.id}:${sub}`}
                className="pl-6"
              >
                {sub}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
