import React, { useState } from "react";
import { HStack } from "../ui/hstack";
import { useTranslation } from "react-i18next";
import { Text } from "../text/text.component";
import { Pressable } from "react-native";
import { EyeIcon, EyeOffIcon, Icon } from "../ui/icon";
import { Colors } from "@/constants/Colors";

export const Balance = () => {
  const { t } = useTranslation();
  const [showBalance, setShowBalance] = useState(false);
  const balance = 1000;

  return (
    <HStack space="md" className="items-center">
      <Text
        className="mr-4"
        fontSize={14}
        fontWeight={400}
        textColor={Colors.DARK_GREEN}
      >
        {t("home.balance", { ns: "home" })}:{" "}
        <Text fontSize={20} fontWeight={600}>
          {showBalance ? `$${balance.toFixed(2)}` : "••••••••••••"}
        </Text>
      </Text>
      <Pressable onPress={() => setShowBalance(!showBalance)}>
        {showBalance ? (
          <Icon as={EyeOffIcon} className="w-4 h-4" color={Colors.DARK_GREEN} />
        ) : (
          <Icon as={EyeIcon} className="w-4 h-4" color={Colors.DARK_GREEN} />
        )}
      </Pressable>
    </HStack>
  );
};
