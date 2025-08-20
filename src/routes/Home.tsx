import LayoutGBA from '@/components/ui/Layout';
import MessageBox from '@/components/ui/MessageBox';
import StepActionYesNo from '@/components/ui/StepAction';
import { useSteps } from '@/hooks/useSteps';
import type { Step } from '@/types/step.type';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

export const Home = () => {
  const navigate = useNavigate();

  const steps = useRef<Step[]>([
    {
      text: 'Welcome to Poke Vote!',
      action: null,
    },
    {
      text: 'Here, you can vote for your favorite Pokémon.',
      action: null,
    },
    {
      text: 'Are you ready to start?',
      action: {
        type: 'yesno',
        yes: () => {
          navigate('/vote');
        },
        no: () => {
          window.close();
        },
      },
    },
  ]);

  const { currentStep } = useSteps({
    max: steps.current.length,
  });

  return (
    <LayoutGBA>
      {steps.current[currentStep].action?.type === 'yesno' && (
        <StepActionYesNo action={steps.current[currentStep].action} className="mt-4 mr-4 ml-auto" />
      )}
      <MessageBox key={currentStep} text={steps.current[currentStep].text} className="mt-auto" />
    </LayoutGBA>
  );
};
