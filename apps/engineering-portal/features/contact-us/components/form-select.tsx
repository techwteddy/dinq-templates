import { Field, FieldLabel } from '@/components/ui/field';
import { FormSelectProps } from '@/features/contact-us/types';

import { ChevronDown } from 'lucide-react';
import { FieldValues } from 'react-hook-form';

export default function FormSelect<T extends FieldValues>({
  register,
  name,
  label,
  placeholder = 'Select an option',
  required = false,
  optionsArray,
}: FormSelectProps<T>) {
  return (
    <Field>
      <FieldLabel htmlFor={name} className={required ? 'required-input' : ''}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          {...register(name)}
          required={required}
          aria-required={required}
          id={name}
          className="flex h-10 w-full items-center justify-between rounded-xs border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {optionsArray.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
    </Field>
  );
}
