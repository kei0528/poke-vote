import type { ReactNode } from "react";

const LayoutGBA = ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-stone-950 min-h-dvh flex items-center justify-center">
      <div className="px-5 w-full max-w-2xl mx-auto py-10 max-h-[480px] h-[75dvh] min-h-[360px] grid bg-stone-900 rounded-4xl">
        {children}
      </div>
    </main>
  );
};

export default LayoutGBA;
