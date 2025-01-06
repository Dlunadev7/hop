import React, { ElementType, useState } from "react";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { InputField, Input as GInput, InputSlot, InputIcon } from "../ui/input";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "../ui/icon";
import { Pressable, TextInputProps } from "react-native";
import { Colors } from "@/constants/Colors";
import { IInputFieldProps } from "@gluestack-ui/input/lib/types";

interface CustomInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e: any) => void;
  error?: string | false | undefined;
  touched?: boolean;
  size?: "sm" | "md" | "lg";
  stretch?: boolean;
  rightIcon?: boolean;
  leftIcon?: boolean;
  icon?: ElementType | undefined;
  pressable?: boolean; // Nueva propiedad
}

export const Input = (
  props: CustomInputProps & TextInputProps & IInputFieldProps
) => {
  const {
    label,
    placeholder,
    value,
    onChangeText,
    onBlur,
    error,
    touched,
    size = "lg",
    stretch,
    keyboardType,
    rightIcon,
    leftIcon,
    icon,
    editable = true,
    pressable = false,
  } = props;

  const [secureTextEntry, setSecureTextEntry] = useState(props.secureTextEntry);

  const InputContent = (
    <GInput
      size={size}
      variant="rounded"
      pointerEvents={pressable ? "none" : "auto"}
    >
      {leftIcon && (
        <InputSlot className="pl-3">
          <InputIcon as={icon} />
        </InputSlot>
      )}
      <InputField
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
        className={`${error ? "placeholder:text-[#9A0000]" : ""}`}
        secureTextEntry={secureTextEntry}
      />
      {rightIcon && (
        <InputSlot
          className="pr-3"
          onPress={() => setSecureTextEntry(!secureTextEntry)}
        >
          <InputIcon
            as={icon ? icon : secureTextEntry ? EyeIcon : EyeOffIcon}
            color={error ? Colors.ERROR : Colors.PRIMARY}
          />
        </InputSlot>
      )}
    </GInput>
  );

  return (
    <FormControl
      isInvalid={!!error && touched}
      className={stretch ? "flex-1" : ""}
    >
      <FormControlLabel>
        <FormControlLabelText
          className={`font-semibold text-lg text-[#10524B] ${
            error && "text-[#9A0000]"
          }`}
        >
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      {pressable ? (
        <Pressable onPress={props.onPress}>{InputContent}</Pressable>
      ) : (
        InputContent
      )}
      {touched && error && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};

export default Input;
