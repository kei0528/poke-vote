import { cn } from '@/styles/shadcn';
import type { ReactNode } from 'react';

const LayoutGBA = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <main className={cn('flex min-h-dvh items-center justify-center bg-stone-950', className)}>
      <div
        data-id="gba-inner"
        className="relative mx-auto grid min-h-[55dvh] w-full max-w-[660px] rounded-4xl bg-stone-900 px-5 py-7 sm:h-auto sm:max-h-none sm:min-h-[500px]"
      >
        {children}
      </div>
    </main>
  );
};

export default LayoutGBA;
