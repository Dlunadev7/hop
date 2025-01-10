import { View, Text, StyleSheet } from "react-native";
import React, { ReactElement } from "react";
import { LinearGradient as ELinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type LineaGradientProps = {
  children: ReactElement | ReactElement[];
  colors?: [string, string, ...string[]];
  style?: object;
};

export const LinearGradient = (props: LineaGradientProps) => {
  const { children, colors, style } = props;
  const insets = useSafeAreaInsets();
  const LinearGradientColors = colors
    ? colors
    : ([Colors.LIGHT_GRADIENT_1, Colors.LIGHT_GRADIENT_2] as const);

  const customStyle = style ? style : styles.wrapper;

  return (
    <ELinearGradient
      colors={LinearGradientColors}
      style={[customStyle, { paddingTop: insets.top + 24 }]}
    >
      {children}
    </ELinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
});
