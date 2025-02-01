import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "../text/text.component";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import {
  CalendarActive,
  Routing,
  UserSquare,
  Booking as BookingSVG,
} from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Box } from "../ui/box";
import { useTranslation } from "react-i18next";

export const Booking = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.bookings}>
      <Text fontSize={18} fontWeight={400} textColor={Colors.DARK_GREEN}>
        {t("home.booking.title", { ns: "home" })}
      </Text>
      <FlatList
        data={[0, 1, 2, 3]}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
        renderItem={() => (
          <Card variant="outline" style={styles.card}>
            <HStack className="gap-1 items-center">
              <CalendarActive width={16} height={16} />
              <Text
                className="items-center gap-2"
                textColor={Colors.SECONDARY}
                fontWeight={600}
                fontSize={14}
              >
                Feb.20,2025 - 12:00 pm
              </Text>
            </HStack>
            <HStack style={styles.card_description}>
              <BookingSVG />
              <Box className="gap-1">
                <Text
                  fontSize={20}
                  fontWeight={600}
                  textColor={Colors.DARK_GREEN}
                >
                  {t("home.services.shortcuts.pickup", { ns: "home" })}
                </Text>
                <Box className="flex-row gap-2">
                  <Routing />
                  <Text fontSize={16} fontWeight={400}>
                    Aeropuerto Int. - Hotel
                  </Text>
                </Box>
                <Box className="flex-row gap-2">
                  <UserSquare />
                  <Text fontSize={16} fontWeight={400}>
                    Ricardo Darin
                  </Text>
                </Box>
                <Text textColor={Colors.GRAY} fontSize={14} fontWeight={400}>
                  Aerolinea Chile , Num. de Vuelo D1122
                </Text>
              </Box>
            </HStack>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bookings: {
    marginTop: 32,
    gap: 12,
  },
  card: {
    height: 176,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    borderRadius: 20,
  },
  card_description: {
    marginTop: 20,
    gap: 12,
  },
});
