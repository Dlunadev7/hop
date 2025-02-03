import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { ReactElement } from "react";
import { Colors } from "@/constants/Colors";

export const Container = ({
  children,
  className,
}: {
  children: ReactElement | ReactElement[];
  className?: string;
}) => {
  return (
    <ScrollView
      className={`px-4 ${className}`}
      style={styles.container}
      contentContainerStyle={styles.content}
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
    paddingBottom: 150,
    flexGrow: 1,
  },
});
