import { View, Text } from "react-native";
import React from "react";
import ToggleSwitch from "toggle-switch-react-native";
import { Colors } from "@/constants/Colors";

export const Switch = ({
  isOn,
  onToggleSwitch,
}: {
  isOn: boolean;
  onToggleSwitch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <ToggleSwitch
      isOn={isOn}
      onColor={Colors.SECONDARY}
      offColor={Colors.LIGHT_GRAY}
      thumbOnStyle={{
        backgroundColor: Colors.PRIMARY,
      }}
      thumbOffStyle={{
        backgroundColor: Colors.LIGHT_GRAY,
      }}
      trackOnStyle={{
        borderColor: Colors.PRIMARY,
        borderWidth: 2,
        width: 50,
      }}
      trackOffStyle={{
        borderColor: Colors.LIGHT_GRAY,
        backgroundColor: Colors.WHITE,
        borderWidth: 2,
        width: 50,
      }}
      size="medium"
      onToggle={() => onToggleSwitch(!isOn)}
    />
  );
};
