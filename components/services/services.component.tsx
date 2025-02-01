import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { Text } from "../text/text.component";
import { HStack } from "../ui/hstack";
import { Box } from "../ui/box";
import { DropOff, PickUp } from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

export const Services = () => {
  const { t } = useTranslation();
  const width = Dimensions.get("window").width / 2 - 25;
  return (
    <View style={styles.services}>
      <Text fontSize={18} fontWeight={400} textColor={Colors.DARK_GREEN}>
        {t("home.services.title", { ns: "home" })}
      </Text>
      <HStack className="w-full">
        <Box className="flex-1 items-center">
          <DropOff width={width} />
          <Text fontSize={18} fontWeight={600} textColor={Colors.DARK_GREEN}>
            {t("home.services.shortcuts.pickup", { ns: "home" })}
          </Text>
        </Box>
        <Box className="flex-1 items-center">
          <PickUp width={width} />
          <Text fontSize={18} fontWeight={600} textColor={Colors.DARK_GREEN}>
            {t("home.services.shortcuts.dropoff", { ns: "home" })}
          </Text>
        </Box>
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({
  services: {
    marginTop: 32,
  },
});
