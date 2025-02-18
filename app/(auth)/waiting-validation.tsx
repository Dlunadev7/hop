import { StyleSheet, View } from "react-native";
import React from "react";
import { Hop } from "@/assets/svg";
import { AssetsImages } from "@/assets/images";
import { VStack } from "@/components/ui/vstack";
import { Image } from "react-native";
import { LinearGradient } from "@/components";
import { Colors } from "@/constants/Colors";
import { Text } from "@/components/text/text.component";
import { useTranslation } from "react-i18next";

export default function FinishOnboarding() {
  const { t } = useTranslation();

  return (
    <LinearGradient>
      <View style={styles.container}>
        <VStack space="lg" className="items-center mb-9">
          <Hop color={Colors.SECONDARY} />
          <Text
            fontSize={28}
            fontWeight={600}
            textColor={Colors.DARK_GREEN}
            textAlign="center"
          >
            {t("home.waiting_validation.account_review", { ns: "home" })}
          </Text>
        </VStack>
        <Image source={AssetsImages.waitingValidation} />
        <VStack space="lg" className="mt-28">
          <Text fontSize={14} fontWeight={400} textAlign="center">
            {t("home.waiting_validation.review_info", { ns: "home" })}
          </Text>
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
