import { StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { LinearGradient } from "@/components";
import { Box } from "@/components/ui/box";
import { router } from "expo-router";
import { RouteProp } from "@react-navigation/native";
import { Hop, Error as ErrorSVG } from "@/assets/svg";

interface ErrorProps {
  IconTop?: React.ComponentType;
  IconBottom?: React.ComponentType;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonAction?: () => string | number | (string | number)[] | null | undefined;
}

type ErrorScreenRouteProp = RouteProp<{ Error: ErrorProps }, "Error">;

export default function Error({ route }: { route?: ErrorScreenRouteProp }) {
  const params = route?.params || {};

  const {
    IconTop = Hop,
    IconBottom = ErrorSVG,
    title = "Ups! Algo salió mal",
    subtitle = "Por favor, intenta nuevamente más tarde.",
    buttonText = "Ir al inicio",
    buttonAction = () => router.replace("/(auth)/sign-in"),
  } = params;

  return (
    <LinearGradient>
      <View style={styles.container}>
        <VStack space="lg" className="items-center mb-9">
          {IconTop && <IconTop />}
          <Box className="mt-12 gap-6">
            <Text className="text-2xl font-semibold text-center color-[#10524B]">
              {title}
            </Text>
            <Text className="text-lg font-semibold text-center color-[#303231]">
              {subtitle}
            </Text>
          </Box>
        </VStack>
        {IconBottom && <IconBottom />}
        <VStack space="lg" className="mt-28">
          <Button
            variant="solid"
            className="rounded-xl bg-[#2EC4B6] self-center"
            onPress={buttonAction}
          >
            <ButtonText className="font-semibold text-lg">
              {buttonText}
            </ButtonText>
          </Button>
        </VStack>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexGrow: 1,
    alignItems: "center",
  },
});
