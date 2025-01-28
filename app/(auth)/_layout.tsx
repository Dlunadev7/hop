import React from "react";
import { Stack } from "expo-router";
import { AuthRoutes } from "@/utils/enum/auth.routes";
import { StatusBar } from "expo-status-bar";

export default function _layout() {
  return (
    <>
      <StatusBar translucent style="dark" />
      <Stack>
        <Stack.Screen
          name={AuthRoutes.ENTRY}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AuthRoutes.SIGN_UP}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AuthRoutes.SIGN_IN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AuthRoutes.FINISH_ONBOARDING}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AuthRoutes.WAITING_VALIDATION}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AuthRoutes.RECOVERY_PASSWORD}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AuthRoutes.NEW_PASSWORD}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AuthRoutes.FINISH_RECOVER_PASSWORD}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AuthRoutes.MAP}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name={AuthRoutes.ONBOARDING}
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
