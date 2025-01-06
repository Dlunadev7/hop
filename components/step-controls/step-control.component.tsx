import React from "react";
import { HStack } from "../ui/hstack";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { ArrowLeft } from "@/assets/svg";
import { Colors } from "@/constants/Colors";

type StepProps = {
  handleBack: () => void;
  handleNext: () => void;
  textBack: string;
  textNext: string;
};

export const StepControl = (props: StepProps) => {
  const { handleBack, handleNext, textBack, textNext } = props;

  return (
    <HStack className="mt-[24px] gap-3 justify-between">
      <Button
        variant="link"
        className="rounded-xl no-underline self-center"
        onPress={handleBack}
      >
        <ButtonIcon as={ArrowLeft} color={Colors.GRAY} />
        <ButtonText className="font-semibold text-lg text-[#8E8E8E]">
          {textBack}
        </ButtonText>
      </Button>
      <Button
        variant="solid"
        className="rounded-xl bg-[#2EC4B6] self-center"
        onPress={handleNext}
      >
        <ButtonText className="font-semibold text-lg">{textNext}</ButtonText>
      </Button>
    </HStack>
  );
};
