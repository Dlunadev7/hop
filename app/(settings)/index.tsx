import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Container, Header, Switch } from "@/components";
import { Text } from "@/components/text/text.component";
import { useTranslation } from "react-i18next";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Pressable, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function Settings() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [toggleSwitch, setToggleSwitch] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={t("settings.title", { ns: "utils" })}
          arrow
          onPressArrow={() => router.back()}
        />
      ),
    });
  }, [navigation]);

  return (
    <Container>
      <Box style={styles.box} className="items-start justify-center gap-4 mt-8">
        <Pressable onPress={() => router.push("/(settings)/account_state")}>
          <Text fontSize={20} fontWeight={400} textColor={Colors.DARK_GREEN}>
            {t("settings.account_state", { ns: "utils" })}
          </Text>
        </Pressable>
        <Divider style={styles.divider} />
        <HStack className="justify-between w-full">
          <Text fontSize={20} fontWeight={400} textColor={Colors.DARK_GREEN}>
            {t("settings.activate_notification", { ns: "utils" })}
          </Text>
          <Switch onToggleSwitch={setToggleSwitch} isOn={toggleSwitch} />
        </HStack>
      </Box>
    </Container>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 156,
    backgroundColor: Colors.LIGHT_GRADIENT_1,
    borderRadius: 40,
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  divider: {
    backgroundColor: Colors.PRIMARY,
    height: 1,
    width: "100%",
  },
});
