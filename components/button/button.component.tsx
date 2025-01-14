import React from "react";
import {
  StyleSheet,
  GestureResponderEvent,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { Text } from "../text/text.component";

interface GradientButtonProps {
  children: any;
  onPress: (event: GestureResponderEvent) => void;
  colors?: any;
  style?: object;
  textClassName?: object;
  type?: string;
  loading?: boolean;
}

export const Button: React.FC<GradientButtonProps> = ({
  children,
  onPress,
  colors = ["#07A999", "#134641"],
  style = {},
  textClassName = {},
  type,
  loading,
}) => {
  return (
    <>
      {type === "ghost" ? (
        <Pressable onPress={onPress} style={[styles.ghost, style]}>
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <Text fontWeight={600} style={[styles.text_ghost, textClassName]}>
              {children}
            </Text>
          )}
        </Pressable>
      ) : (
        <Pressable onPress={onPress} style={[styles.button, style]}>
          <LinearGradient colors={colors} style={styles.gradient}>
            {loading ? (
              <ActivityIndicator color={Colors.WHITE} />
            ) : (
              <Text fontWeight={600} style={[styles.text, textClassName]}>
                {children}
              </Text>
            )}
          </LinearGradient>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "center",
  },
  gradient: {
    height: 40,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
  },
  ghost: {
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  text_ghost: {
    color: Colors.DARK_GREEN,
    fontSize: 16,
    fontWeight: 600,
  },
});
