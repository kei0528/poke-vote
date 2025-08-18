import { useEffect, useState } from "react";

type Params = {
  max: number;
};

type Returns = {
  currentStep: number;
};

export const useSteps = ({ max }: Params): Returns => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    function onNext() {
      setCurrentStep((state) => {
        if (state >= max - 1) {
          return state;
        }
        return state + 1;
      });
    }

    function onKeyup(e: KeyboardEvent) {
      if (e.code === "Space") {
        onNext();
      }
    }

    function onClick(e: MouseEvent) {
      if (e.detail === 0) return;
      onNext();
    }

    window.addEventListener("keyup", onKeyup);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keyup", onKeyup);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return { currentStep };
};
