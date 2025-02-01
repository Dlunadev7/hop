import { Stack } from "expo-router";
import { ProfileRoutes } from "@/utils/enum/profile.routes";
import { StyleSheet, View } from "react-native";

export default function ProfileDrawerLayout() {
  return (
    <Stack>
      <Stack.Screen name={ProfileRoutes.PROFILE} />
      <Stack.Screen name={ProfileRoutes.PERSONAL_DATA} />
      <Stack.Screen name={ProfileRoutes.VEHICLE_DATA} />
      <Stack.Screen name={ProfileRoutes.DOCUMENTATION} />
      <Stack.Screen name={ProfileRoutes.BANK_ACCOUNT} />
      <Stack.Screen name={ProfileRoutes.HOTEL} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingBottom: 100,
  },
});
