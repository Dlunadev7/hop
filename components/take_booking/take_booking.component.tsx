import React from "react";
import { Badge, BadgeIcon } from "../ui/badge";
import { CalendarActive, Car, ClockActive, LocationFilled } from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Text } from "../text/text.component";
import { StyleSheet, View } from "react-native";
import Input from "../input/input.component";
import { HStack } from "../ui/hstack";
import { useTranslation } from "react-i18next";

export const TakeABooking = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.floating_content} className="p-3">
      <Badge
        className="gap-2 rounded-full items-center justify-center px-4"
        style={styles.badge}
      >
        <BadgeIcon as={Car} className="w-4 h-4" color={Colors.DARK_GREEN} />
        <Text fontSize={14} fontWeight={400} textColor={Colors.DARK_GREEN}>
          {t("home.booking.booking_hopper", { ns: "home" })}
        </Text>
      </Badge>
      <View className="gap-4">
        <HStack style={styles.hour} className="gap-2">
          <Input
            label=""
            onBlur={() => {}}
            onChangeText={() => {}}
            placeholder="DD/MM/AAAA"
            leftIcon
            icon={CalendarActive}
            stretch
          />
          <Input
            label=""
            onBlur={() => {}}
            onChangeText={() => {}}
            placeholder="HH : MM"
            leftIcon
            icon={ClockActive}
            stretch
          />
        </HStack>
        <Input
          label=""
          onBlur={() => {}}
          onChangeText={() => {}}
          placeholder={t("home.booking.destinity_placeholder", { ns: "home" })}
          stretch
          leftIcon
          icon={LocationFilled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floating_content: {
    backgroundColor: Colors.LIGHT_GRADIENT_1,
    marginTop: 16,
    height: 164,
    borderRadius: 32,
  },
  badge: {
    backgroundColor: Colors.PRIMARY,
    alignSelf: "flex-start",
  },
  hour: {
    marginTop: 12,
  },
});
