import { StyleSheet, View } from "react-native";
import React from "react";
import { Hop } from "@/assets/svg";
import { AssetsImages } from "@/assets/images";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
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
            Tu cuenta se encuentra en revisión
          </Text>
        </VStack>
        <Image source={AssetsImages.waitingValidation} />
        <VStack space="lg" className="mt-28">
          <Text className="text-center text-sm">
            Estamos revisando tu información, esto puede tardar unos días.
            Podrás iniciar sesión una vez que tu cuenta sea validada por nuestro
            equipo.
          </Text>
          <Button
            variant="solid"
            className="rounded-xl bg-[#2EC4B6] self-center"
            onPress={() => router.replace(AuthRoutesLink.ENTRY)}
          >
            <ButtonText className="font-semibold text-lg">Aceptar</ButtonText>
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
