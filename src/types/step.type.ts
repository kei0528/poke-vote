export type StepActionYesNo = {
  type: "yesno";
  yes: () => void;
  no: () => void;
};

export type StepActionFourOptions = {
  type: "fourOptions";
  options: {
    label: string;
    onSelect: () => void;
  }[];
};

export type Step = {
  text: string;
  action: StepActionYesNo | StepActionFourOptions | null;
};
