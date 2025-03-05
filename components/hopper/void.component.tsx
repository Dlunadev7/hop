import { View } from "react-native";
import React from "react";
import { LinearGradient } from "../linear-gradient/LinearGradient";
import { HStack } from "../ui/hstack";
import { Warning } from "@/assets/svg";
import { Text } from "../text/text.component";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

export const Void = ({ type }: { type?: string }) => {
  const { t } = useTranslation();

  console.log(type);

  return (
    <LinearGradient
      colors={["#134641", "#07A999"]}
      locations={[0.0, 0.9]}
      style={{
        height: 138,
        width: "100%",
        borderRadius: 20,
        marginTop: 23,
        paddingHorizontal: 20,
      }}
    >
      <HStack className="gap-5 items-center justify-center flex-1">
        <View className="bg-[#9FE4DD50] rounded-full p-3">
          <Warning />
        </View>
        <Text fontSize={20} textColor={Colors.WHITE} className="flex-1">
          {type === "vehicle" ? (
            <>
              {
                t("home.hopper.void", { ns: "home" }).split(
                  t("home.hopper.vehicle", { ns: "home" })
                )[0]
              }

              <Text fontWeight={600} fontSize={20} textColor={Colors.WHITE}>
                {t("home.hopper.vehicle", { ns: "home" })}
              </Text>

              {
                t("home.hopper.void", { ns: "home" }).split(
                  t("home.hopper.vehicle", { ns: "home" })
                )[1]
              }
            </>
          ) : (
            t("home.hopper.void_bank", { ns: "home" })
          )}
        </Text>
      </HStack>
    </LinearGradient>
  );
};
