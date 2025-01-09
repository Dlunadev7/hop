import { AssetsImages } from "@/assets/images";
import React, { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { Image, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { LinearGradient } from "@/components";
import { useAuth } from "@/context/auth.context";

export default function Entry() {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      router.replace("/(tabs)");
    }
  }, [token]);

  return (
    <>
      <StatusBar translucent style="light" />
      <LinearGradient colors={[Colors.SECONDARY, Colors.PRIMARY]}>
        <Image source={AssetsImages.logo} className="m-auto" />
        <VStack space="sm" className="mt-auto mb-20">
          <Button
            variant="solid"
            style={styles.button}
            className="rounded-xl"
            onPress={() => router.push(AuthRoutesLink.SIGN_IN)}
          >
            <ButtonText className="font-semibold text-lg">
              Iniciar sesión
            </ButtonText>
          </Button>
          <Button
            variant="link"
            className="px-5 no-underline"
            onPress={() => router.replace(AuthRoutesLink.SIGN_UP)}
          >
            <ButtonText
              style={styles.text_button}
              className="font-semibold text-lg"
            >
              Crea una cuenta
            </ButtonText>
          </Button>
        </VStack>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text_button: {
    color: Colors.DARK_GREEN,
  },
  button: {
    backgroundColor: Colors.SECONDARY,
  },
});
