import { FormInputProps } from '@/features/contact-us/types';

import { FieldValues, Controller } from 'react-hook-form';

import { Field, FieldLabel, FieldError } from '@/components/ui/field';

import { Input } from '@/components/ui/input';

export default function FormInput<T extends FieldValues>({
  name,
  control,
  required = false,
  placeholder,
  label,
  type = 'text',
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            className={required ? 'required-input' : ''}
            htmlFor={name}
          >
            {label}
          </FieldLabel>
          <Input
            type={type}
            id={name}
            {...field}
            aria-invalid={fieldState.invalid}
            required={required}
            aria-required={required}
            placeholder={placeholder}
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
