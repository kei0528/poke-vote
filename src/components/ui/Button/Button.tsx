import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/styles/shadcn';

const buttonVariants = cva(
  'block text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none outline-none cursor-pointer',
  {
    variants: {
      variant: {
        default: '',
        submit:
          'border-2 border-white px-3 py-0.5 bg-[#96BC69] ring-3 ring-stone-950 text-white rounded-sm hover:bg-[#5c7240] focus-visible:bg-[#5c7240] duration-100 text-sm',
        step: "relative pl-4 pr-2 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-[url('/svg/triangle-black-right.svg')] before:bg-no-repeat before:bg-contain hover:before:block focus-visible:before:block before:hidden",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant }), className)} {...props} />
  );
}

export { Button, buttonVariants };
