import React, { useState } from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { TextProps } from "./text.type";
import { scaleSize } from "@/helpers/scale-size";
import styles from "./styles";
import { Colors } from "@/constants/Colors";

export const Text = (props: RNTextProps & TextProps) => {
  const {
    underline = false,
    fontSize = 14,
    textColor = Colors.BLACK,
    textAlign,
    fontWeight = 300,
    transform = "none",
    style,
    onPress,
    children,
    maxLength,
    className,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const textDecoration = underline ? "underline" : "none";

  let displayedText = children as string;
  if (maxLength && !isExpanded && displayedText.length > maxLength) {
    displayedText = `${displayedText.substring(0, maxLength)}`;
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const fontWeightMap: { [key: number]: string } = {
    100: "Outfit-Thin",
    200: "Outfit-ExtraLight",
    300: "Outfit-Light",
    400: "Outfit-Regular",
    500: "Outfit-Medium",
    600: "Outfit-SemiBold",
    700: "Outfit-Bold",
    800: "Outfit-ExtraBold",
    900: "Outfit-Black",
  };

  return (
    <RNText
      onPress={onPress}
      allowFontScaling={false}
      style={[
        {
          color: textColor,
          textDecorationLine: textDecoration,
          fontSize: scaleSize(fontSize),
          textAlign,
          textTransform: transform,
          fontFamily: fontWeightMap[fontWeight],
        },
        style,
      ]}
      className={className}
    >
      {displayedText}
      {maxLength && !isExpanded && (children as string).length > maxLength && (
        <RNText onPress={() => handleToggleExpand()} style={styles.more}>
          ...mas
        </RNText>
      )}
    </RNText>
  );
};
