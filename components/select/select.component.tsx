import React from "react";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import {
  Select as GSelect,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "../ui/select";
import { AlertCircleIcon, ChevronDownIcon } from "../ui/icon";
import { Colors } from "@/constants/Colors";
import { Text } from "../ui/text";

interface Option {
  label: string;
  value: string;
}

interface CustomFormControlProps {
  label: string;
  options: Option[];
  placeholder?: string;
  variant?: "rounded";
  size?: "sm" | "md" | "lg";
  onSelect: (value: string) => void;
  error?: string | false | undefined;
  touched?: boolean;
  customClassNames?: {
    formControl?: string;
    formControlLabel?: string;
    labelText?: string;
    select?: string;
    trigger?: string;
    input?: string;
    icon?: string;
    content?: string;
    item?: string;
  };
}

export const Select = (props: CustomFormControlProps) => {
  const {
    label,
    options,
    placeholder = "Seleccione una opción",
    variant = "rounded",
    size = "lg",
    onSelect,
    error,
    touched,
    customClassNames = {},
  } = props;

  return (
    <FormControl className={customClassNames.formControl}>
      <FormControlLabel className={customClassNames.formControlLabel}>
        <FormControlLabelText
          className={`font-semibold text-lg ${
            touched && error ? "text-[#9A0000]" : "text-[#10524B]"
          } ${customClassNames.labelText}`}
        >
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      <GSelect onValueChange={onSelect}>
        <SelectTrigger
          variant={variant}
          size={size}
          className={error ? "border-[#9A0000]" : ""}
        >
          <SelectInput
            placeholder={placeholder}
            className={`flex-1 ${error ? "placeholder:text-[#9A0000]" : ""}`}
          />
          <SelectIcon
            className={`mr-3 ${customClassNames.icon}`}
            as={ChevronDownIcon}
            color={error ? Colors.ERROR : Colors.PRIMARY}
          />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent className={`pb-10 ${customClassNames.content}`}>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {options.map(({ label, value }) => (
              <SelectItem
                key={value}
                label={label}
                value={value}
                className={customClassNames.item}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </GSelect>
      {touched && error && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};
