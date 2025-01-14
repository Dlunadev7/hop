import React from "react";
import { HStack } from "../ui/hstack";
import { ArrowLeftRounded } from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Button } from "../button/button.component";
import { ButtonIcon } from "../ui/button";
import { ActivityIndicator } from "react-native";

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
    <HStack className="justify-between mt-[50px]">
      <Button type="ghost" onPress={handleBack}>
        <ArrowLeftRounded color={Colors.GRAY} />
      </Button>
      <Button onPress={handleNext} loading={loading}>
        {textNext}
      </Button>
    </HStack>
  );
};
