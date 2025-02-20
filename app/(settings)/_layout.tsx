import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="/" />
      <Stack.Screen name="account_state" />
      <Stack.Screen name="report_issue" />
    </Stack>
  );
}
