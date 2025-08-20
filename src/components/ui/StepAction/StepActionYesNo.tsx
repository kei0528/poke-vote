import type { StepActionYesNo as StepActionYesNoType } from '@/types/step.type';
import Button from '../Button';
import { useEffect, useRef } from 'react';

const StepActionYesNo = ({
  action,
  className = '',
}: {
  action: Omit<StepActionYesNoType, 'type'>;
  className?: string;
}) => {
  const buttonYes = useRef<HTMLButtonElement>(null);
  const buttonNo = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonYes.current || !buttonNo.current) return;

    function onArrowPress(e: KeyboardEvent) {
      if (e.code === 'ArrowDown') {
        buttonNo.current?.focus();
      } else if (e.code === 'ArrowUp') {
        buttonYes.current?.focus();
      }
    }

    window.addEventListener('keyup', onArrowPress);

    return () => window.removeEventListener('keyup', onArrowPress);
  }, []);

  return (
    <div
      className={`relative h-fit w-fit rounded-xl border-x-8 border-y-5 border-[#746A88] bg-[#FFFBFF] [background-clip:padding-box] py-3 pr-4 pl-6 [&_*]:text-stone-950 ${className}`}
    >
      <Button autoFocus variant="step" onClick={action.yes} ref={buttonYes} className="mb-2">
        Yes
      </Button>
      <Button variant="step" onClick={action.no} ref={buttonNo}>
        No
      </Button>
    </div>
  );
};

export default StepActionYesNo;
