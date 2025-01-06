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

export default function FinishRecoverPassword() {
  return (
    <LinearGradient>
      <View style={styles.container}>
        <VStack space="4xl" className="items-center mb-9">
          <Hop />
          <Text className="text-2xl font-semibold text-center">
            Tu contraseña se cambió correctamente{" "}
          </Text>
        </VStack>
        <Image source={AssetsImages.success} />
        <VStack space="lg" className="mt-28">
          <Button
            variant="solid"
            className="rounded-xl bg-[#2EC4B6] self-center"
            onPress={() => {
              router.dismissAll();
              router.replace(AuthRoutesLink.SIGN_IN);
            }}
          >
            <ButtonText className="font-semibold text-lg">
              Ir al inicio
            </ButtonText>
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
    justifyContent: "center",
    alignItems: "center",
  },
});
