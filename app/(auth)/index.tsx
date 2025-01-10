import React from "react";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { LinearGradient } from "@/components";
import { HStack } from "@/components/ui/hstack";
import { Hop } from "@/assets/svg";
import { Text } from "@/components/ui/text";

export default function Entry() {
  const { t } = useTranslation();

  return (
    <>
      <StatusBar translucent style="light" />
      <LinearGradient colors={[Colors.SECONDARY, Colors.PRIMARY]}>
        <VStack className="justify-center self-center items-center max-w-[270px]">
          <Hop
            width={200}
            height={200}
            color={Colors.WHITE}
            className="self-center items-center justify-center"
          />
          <Text className="text-center text-xl color-white font-semibold">
            {t("entry.title", { ns: "auth" })}
          </Text>
        </VStack>
        <VStack space="sm" className="mt-auto mb-20 items-center">
          <Button
            variant="solid"
            style={styles.button}
            className="rounded-xl"
            onPress={() => router.push(AuthRoutesLink.SIGN_IN)}
          >
            <ButtonText className="font-semibold text-lg">
              {t("entry.signInButton", { ns: "auth" })}
            </ButtonText>
          </Button>
          <Button
            variant="link"
            className="px-5 no-underline max-w-44"
            onPress={() => router.replace(AuthRoutesLink.SIGN_UP)}
          >
            <ButtonText
              style={styles.text_button}
              className="font-semibold text-lg"
            >
              {t("entry.signUpButton", { ns: "auth" })}{" "}
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
  },
  text_button: {
    color: Colors.DARK_GREEN,
  },
  button: {
    backgroundColor: Colors.SECONDARY,
    maxWidth: 176,
  },
});
