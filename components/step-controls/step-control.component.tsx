import React from "react";
import { HStack } from "../ui/hstack";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { ArrowLeftRounded } from "@/assets/svg";
import { Colors } from "@/constants/Colors";

type StepProps = {
  handleBack: () => void;
  handleNext: () => void;
  textBack: string;
  textNext: string;
  loading?: boolean;
};

export const StepControl = (props: StepProps) => {
  const { handleBack, handleNext, textNext, loading } = props;

  return (
    <HStack className="gap-3 justify-between mt-auto">
      <Button
        variant="link"
        className="rounded-xl no-underline self-center"
        onPress={handleBack}
      >
        {!loading ? (
          <ButtonIcon
            as={ArrowLeftRounded}
            width={40}
            height={40}
            color={Colors.GRAY}
          />
        ) : (
          <ButtonSpinner color={Colors.WHITE} />
        )}
      </Button>
      <Button
        variant="solid"
        className="rounded-xl bg-[#2EC4B6] self-center"
        onPress={handleNext}
      >
        {!loading ? (
          <ButtonText className="font-semibold text-lg">{textNext}</ButtonText>
        ) : (
          <ButtonSpinner color={Colors.WHITE} />
        )}
      </Button>
    </HStack>
  );
};
