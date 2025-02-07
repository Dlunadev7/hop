import { View } from "react-native";
import React from "react";
import { HStack } from "../ui/hstack";
import { AvatarHopper } from "@/assets/svg";
import { Box } from "../ui/box";
import { Text } from "../text/text.component";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

export default function Advice() {
  const { t } = useTranslation();
  return (
    <View className="w-full rounded-[20px] mt-6 p-[20px] justify-center border-[#2EC4B5] border-[1px]">
      <HStack className="gap-3 items-center rounded-full">
        <View>
          <AvatarHopper width={92} height={92} />
        </View>
        <Box className="flex-1 gap-2">
          <Text textColor={Colors.SECONDARY} fontSize={18} fontWeight={600}>
            {t("home.hopper.advice.title", { ns: "home" })}
          </Text>
          <Text textColor={Colors.GRAY} fontSize={16} fontWeight={400}>
            {t("home.hopper.advice.description", { ns: "home" })}
          </Text>
        </Box>
      </HStack>
    </View>
  );
}
