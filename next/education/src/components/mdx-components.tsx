import * as React from 'react';
import * as runtime from 'react/jsx-runtime';
import { Callout } from '@/components/mdx/Callout';
import { Icons } from '@/components/ui/Icons';

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType<any>>;
}

const getMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

const components = {
  Callout,
  Icons,
  // Add more custom components here
};

export function MDXContent({ code, components: userComponents }: MDXProps) {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);
  return <Component components={{ ...components, ...userComponents }} />;
}
