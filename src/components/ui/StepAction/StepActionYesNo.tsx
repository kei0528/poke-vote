import type { StepActionYesNo as StepActionYesNoType } from "@/types/step.type";
import { Button } from "../button";
import { useEffect, useRef } from "react";

const StepActionYesNo = ({ action }: { action: StepActionYesNoType }) => {
  const buttonYes = useRef<HTMLButtonElement>(null);
  const buttonNo = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonYes.current || !buttonNo.current) return;

    function onArrowPress(e: KeyboardEvent) {
      if (e.code === "ArrowDown") {
        buttonNo.current?.focus();
      } else if (e.code === "ArrowUp") {
        buttonYes.current?.focus();
      }
    }

    window.addEventListener("keyup", onArrowPress);

    return () => window.removeEventListener("keyup", onArrowPress);
  }, []);

  return (
    <div className="w-fit rounded-xl relative border-x-8 border-y-5 border-[#DE4340] bg-[#6BA2A5] [background-clip:padding-box] pl-6 pr-4 py-3 [&_*]:text-white">
      <Button autoFocus variant="step" onClick={action.yes} ref={buttonYes}>
        Yes
      </Button>
      <Button variant="step" onClick={action.no} ref={buttonNo}>
        No
      </Button>
    </div>
  );
};

export default StepActionYesNo;
