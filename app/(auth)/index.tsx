import React from "react";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "@/components";
import { Hop } from "@/assets/svg";
import { Button } from "@/components/button/button.component";
import { Text } from "@/components/text/text.component";
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
          <Text
            fontSize={20}
            fontWeight={600}
            textAlign="center"
            textColor={Colors.WHITE_SECONDARY}
          >
            {t("entry.title", { ns: "auth" })}
          </Text>
        </VStack>
        <VStack space="lg" className="mt-auto mb-20 items-center">
          <Button onPress={() => router.push(AuthRoutesLink.SIGN_IN)}>
            {t("entry.signInButton", { ns: "auth" })}
          </Button>
          <Button
            type="ghost"
            onPress={() => router.replace(AuthRoutesLink.ONBOARDING)}
          >
            {t("entry.signUpButton", { ns: "auth" })}
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
    minWidth: 176,
  },
});
