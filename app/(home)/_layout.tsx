import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { HomeRoutes } from "@/utils/enum/home.routes";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name={HomeRoutes.MAP_HOME}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={HomeRoutes.CONFIRMATION}
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
