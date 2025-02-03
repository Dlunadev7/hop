import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import React from "react";
import { Text } from "../text/text.component";
import { HStack } from "../ui/hstack";
import { Box } from "../ui/box";
import { DropOff, PickUp } from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { HomeRoutesLink } from "@/utils/enum/home.routes";
import { travelTypeValues } from "@/utils/enum/travel.enum";

export const Services = () => {
  const { t } = useTranslation();
  const width = Dimensions.get("window").width / 2 - 25;
  return (
    <View style={styles.services}>
      <Text fontSize={18} fontWeight={400} textColor={Colors.DARK_GREEN}>
        {t("home.services.title", { ns: "home" })}
      </Text>
      <HStack className="w-full">
        <Pressable
          onPress={() =>
            router.push({
              pathname: HomeRoutesLink.MAP_HOME,
              params: { type: travelTypeValues.PICKUP },
            })
          }
          className="flex-1 items-center"
        >
          <DropOff width={width} />
          <Text fontSize={18} fontWeight={600} textColor={Colors.DARK_GREEN}>
            {t("home.services.shortcuts.pickup", { ns: "home" })}
          </Text>
        </Pressable>
        <Pressable
          onPress={() =>
            router.push({
              pathname: HomeRoutesLink.MAP_HOME,
              params: { type: travelTypeValues.DROPOFF },
            })
          }
          className="flex-1 items-center"
        >
          <PickUp width={width} />
          <Text fontSize={18} fontWeight={600} textColor={Colors.DARK_GREEN}>
            {t("home.services.shortcuts.dropoff", { ns: "home" })}
          </Text>
        </Pressable>
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({
  services: {
    marginTop: 32,
  },
});
