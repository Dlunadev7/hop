import { StyleSheet, View } from "react-native";
import React from "react";
import { Hop } from "@/assets/svg";
import { AssetsImages } from "@/assets/images";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Image } from "react-native";
import { LinearGradient } from "@/components";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button/button.component";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { Colors } from "@/constants/Colors";

export default function FinishOnboarding() {
  const { t } = useTranslation();
  return (
    <LinearGradient>
      <View style={styles.container}>
        <VStack space="lg" className="items-center mb-9">
          <Hop color={Colors.PRIMARY} />
          <Text className="text-2xl font-semibold">
            {t("signup.finishOnboarding.header")}
          </Text>
        </VStack>
        <Image source={AssetsImages.onboardingSuccess} />
        <VStack space="lg" className="mt-28">
          <Text className="text-center text-sm">
            {t("signup.finishOnboarding.description")}
          </Text>
          <Button
            onPress={() =>
              router.replace({
                pathname: "/(tabs)/index",
                params: { step: 4 },
              })
            }
          >
            {t("signup.finishOnboarding.button")}
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
    alignItems: "center",
  },
});
