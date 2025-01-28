import { View, Pressable, StyleSheet } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { Text } from "../text/text.component";
import { Colors } from "@/constants/Colors";

type TooltipProps = {
  documentation: any;
  setShowTooltip: Dispatch<SetStateAction<boolean>>;
};

export default function Tooltip({
  documentation,
  setShowTooltip,
}: TooltipProps) {
  console.log("asd", documentation);
  return (
    <Pressable style={styles.tooltip} onPress={() => setShowTooltip(false)}>
      <View style={styles.tooltip_description} />
      <Text textColor={Colors.WHITE}>{documentation.info}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: "absolute",
    left: -15,
    marginTop: 8,
    padding: 8,
    bottom: 28,
    backgroundColor: "#4B5563",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    zIndex: 9999,
    width: 250,
  },
  tooltip_description: {
    position: "absolute",
    left: 16,
    top: 52,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#4B5563",
  },
});
