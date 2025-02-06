import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { ReactElement } from "react";
import { Colors } from "@/constants/Colors";

export const Container = ({
  children,
  className,
  style,
  extraHeight = true,
}: {
  children: ReactElement | ReactElement[];
  className?: string;
  style?: any;
  extraHeight?: boolean;
}) => {
  return (
    <ScrollView
      className={`px-4 ${className}`}
      style={[styles.container, style]}
      contentContainerStyle={[
        styles.content,
        extraHeight ? styles.extraHeight : { paddingBottom: 12 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    flexGrow: 1,
  },
  extraHeight: {
    paddingBottom: 150,
  },
});
