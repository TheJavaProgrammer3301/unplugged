// MDXRenderer.tsx
import { compile } from '@mdx-js/mdx/lib/compile';
import { useEffect, useState } from 'react';
import * as runtime from 'react/jsx-runtime';

interface Props {
  source: string;
}

export function MDXRenderer({ source }: Props) {
  const [Component, setComponent] = useState<React.ElementType | null>(null);

  useEffect(() => {
    const compileMDX = async () => {
      const compiled = await compile(source, {
        outputFormat: 'function-body',
        jsx: true,
        development: import.meta.env.DEV,
      });

      const code = String(compiled);

      // Dynamically evaluate the compiled code using the MDX runtime
      const { default: MDXComponent } = await (async () => {
        const fn = new Function('React', ...Object.keys(runtime), `${code}`);
        return { default: fn({ ...runtime }) };
      })();

      setComponent(() => MDXComponent);
    };

    compileMDX();
  }, [source]);

  return Component ? <Component /> : <p>Loading...</p>;
}
