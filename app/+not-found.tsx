import { Text } from "@/components/ui/text";
import { Link, router, Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Page Not Found</Text>
        <Text style={styles.description}>
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </Text>
        <Button style={styles.button} onPress={() => router.replace("/")}>
          Go Home
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#343A40",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    color: "#495057",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#868E96",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#0D6EFD",
    borderRadius: 5,
  },
});
