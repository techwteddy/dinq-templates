import { InputField } from '../types';

export const inputFields: InputField[] = [
  {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter first name',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter last name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
  },
  {
    name: 'phone',
    label: 'Phone',
    placeholder: '+1 234 567 8900',
    type: 'tel',
  },
];
