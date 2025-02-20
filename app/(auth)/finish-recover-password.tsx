import { StyleSheet, View } from "react-native";
import React from "react";
import { Hop } from "@/assets/svg";
import { AssetsImages } from "@/assets/images";
import { VStack } from "@/components/ui/vstack";
import { Image } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "@/components";
import { Colors } from "@/constants/Colors";
import { Text } from "@/components/text/text.component";
import { Button } from "@/components/button/button.component";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { useTranslation } from "react-i18next";

export default function FinishRecoverPassword() {
  const { t } = useTranslation();
  return (
    <LinearGradient>
      <View style={styles.container}>
        <VStack space="4xl" className="items-center mb-9">
          <Hop color={Colors.SECONDARY} />
          <Text
            fontSize={28}
            fontWeight={600}
            textAlign="center"
            textColor={Colors.DARK_GREEN}
          >
            {t("new_password.password_changed_successfully")}
          </Text>
        </VStack>
        <Image source={AssetsImages.success} />
        <VStack space="lg" className="mt-28 w-full">
          <Button
            onPress={() => {
              router.replace(AuthRoutesLink.SIGN_IN);
            }}
            stretch
          >
            {t("new_password.go_to_home")}
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
