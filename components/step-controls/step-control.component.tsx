import React from "react";
import { HStack } from "../ui/hstack";
import { ArrowLeftRounded } from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Button } from "../button/button.component";
import { ButtonIcon } from "../ui/button";
import { ActivityIndicator } from "react-native";
import { VStack } from "../ui/vstack";

type StepProps = {
  handleBack: () => void;
  handleNext: () => void;
  textBack: string;
  textNext: string;
  loading?: boolean;
  vertical?: boolean;
  color?: string;
};

export const StepControl = (props: StepProps) => {
  const {
    handleBack,
    handleNext,
    textNext,
    textBack,
    loading,
    vertical,
    color,
  } = props;

  {
    return vertical ? (
      <VStack className="justify-center gap-3 mt-[50px]">
        <Button onPress={handleNext} loading={loading}>
          {textNext}
        </Button>
        <Button
          type="ghost"
          onPress={handleBack}
          textClassName={{
            color: color ? color : Colors.DARK_GREEN,
          }}
        >
          {textBack}
        </Button>
      </VStack>
    ) : (
      <HStack className="justify-between mt-[50px]">
        <Button type="ghost" onPress={handleBack}>
          <ArrowLeftRounded color={Colors.GRAY} />
        </Button>
        <Button onPress={handleNext} loading={loading}>
          {textNext}
        </Button>
      </HStack>
    );
  }
};
