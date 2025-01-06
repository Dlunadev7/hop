import { StyleSheet, View } from "react-native";
import React from "react";
import { Hop } from "@/assets/svg";
import { AssetsImages } from "@/assets/images";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { VStack } from "@/components/ui/vstack";
import { Image } from "react-native";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { LinearGradient } from "@/components";

export default function FinishOnboarding() {
  return (
    <LinearGradient>
      <View style={styles.container}>
        <VStack space="lg" className="items-center mb-9">
          <Hop />
          <Text className="text-2xl font-semibold">
            ¡Gracias por registrarte!
          </Text>
        </VStack>
        <Image source={AssetsImages.onboardingSuccess} />
        <VStack space="lg" className="mt-28">
          <Text className="text-center text-sm">
            Enviamos tu formulario, nuestro equipo revisará tus datos y
            recibirás un email pronto.
          </Text>
          <Button
            variant="solid"
            className="rounded-xl bg-[#2EC4B6] self-center"
            onPress={() => router.replace(AuthRoutesLink.WAITING_VALIDATION)}
          >
            <ButtonText className="font-semibold text-lg">Finalizar</ButtonText>
          </Button>
        </VStack>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 24,
  },
  container: {
    paddingHorizontal: 16,
    flexGrow: 1,
    // justifyContent: "space-between",
    alignItems: "center",
  },
});
