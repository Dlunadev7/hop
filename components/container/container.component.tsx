import { View, Text, StyleSheet } from "react-native";
import React, { ReactElement } from "react";
import { Colors } from "@/constants/Colors";

export const Container = ({
  children,
  className,
}: {
  children: ReactElement | ReactElement[];
  className: string;
}) => {
  return (
    <View className={`px-4 ${className}`} style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
