import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "../text/text.component";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import {
  Booking,
  Calendar,
  CalendarActive,
  DolarCircle,
  Location,
  MessageActive,
  Messages,
  Routing,
  UserSquare,
} from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Card } from "../ui/card";
import { formattedDate } from "@/helpers/parse-date";
import { status } from "@/helpers/parser-names";
import { travelTypeValues } from "@/utils/enum/travel.enum";
import { FlatList } from "react-native-gesture-handler";
import { VStack } from "../ui/vstack";
import { Badge } from "../ui/badge";
import { HomeRoutesLink } from "@/utils/enum/home.routes";

export const BookingsHopper = ({ bookings }: { bookings: number[] }) => {
  const { t } = useTranslation();
  return (
    <View className="mt-6">
      <Text fontSize={16} fontWeight={400} textColor={Colors.DARK_GREEN}>
        {t("home.hopper.bookings.title", { ns: "home" })}
      </Text>
      {bookings?.length > 0 ? (
        <FlatList
          data={bookings}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          className="mt-4"
          contentContainerClassName="gap-2"
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const { date, time } = formattedDate(new Date());

            return (
              <Pressable
                className="min-w-[350]"
                key={index}
                onPress={() => router.push(HomeRoutesLink.MAP_HOPPER)}
              >
                <Card variant="outline" style={styles.card}>
                  <HStack className="gap-1 items-center">
                    <CalendarActive width={16} height={16} />
                    <Text
                      className="items-center gap-2"
                      textColor={Colors.SECONDARY}
                      fontWeight={600}
                      fontSize={14}
                    >
                      {date} - {time}
                    </Text>
                  </HStack>
                  <VStack className="mt-2 gap-2">
                    <Box className="gap-2 flex-row items-center">
                      <Booking />
                      <Text
                        fontSize={20}
                        fontWeight={600}
                        textColor={Colors.DARK_GREEN}
                      >
                        {status["PICKUP" as travelTypeValues]}
                      </Text>
                    </Box>
                    <Box className="flex-row gap-2 shrink-1 max-w-[250] pr-2">
                      <Routing />
                      <Text
                        fontSize={16}
                        textColor={Colors.GRAY}
                        fontWeight={400}
                        numberOfLines={1}
                      >
                        Somewhere - Over the rainbow
                      </Text>
                    </Box>
                    <Box className="flex-row gap-2">
                      <UserSquare />
                      <Text
                        fontSize={16}
                        textColor={Colors.GRAY}
                        fontWeight={400}
                      >
                        Isaias
                      </Text>
                    </Box>
                    <Box className="flex-row gap-2">
                      <MessageActive />
                      <Text
                        fontSize={16}
                        textColor={Colors.GRAY}
                        fontWeight={400}
                      >
                        +33 1122 2233
                      </Text>
                    </Box>
                    <HStack className="justify-between">
                      <Box className="flex-row items-center gap-2">
                        <Location color={Colors.SECONDARY} />
                        <Text
                          textColor={Colors.SECONDARY}
                          underline
                          fontSize={14}
                        >
                          En el punto de partida
                        </Text>
                      </Box>
                      <Badge className="rounded-full bg-[#9FE4DD] gap-1">
                        <DolarCircle />
                        <Text
                          fontSize={18}
                          fontWeight={600}
                          textColor={Colors.DARK_GREEN}
                        >
                          $4.056
                        </Text>
                      </Badge>
                    </HStack>
                  </VStack>
                </Card>
              </Pressable>
            );
          }}
        />
      ) : (
        <Box className="mt-4 rounded-[20px] py-[14px] bg-[#E1F5F3]">
          <HStack className="px-5 gap-3 items-center">
            <View className="bg-[#9FE4DD] rounded-full p-2">
              <Calendar />
            </View>
            <Text textColor={Colors.GRAY} fontSize={16} fontWeight={400}>
              {t("home.hopper.bookings.description", { ns: "home" })}
            </Text>
          </HStack>
        </Box>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bookings: {
    marginTop: 32,
    gap: 12,
  },
  card: {
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    borderRadius: 20,
    flex: 1,
  },
  card_description: {
    marginTop: 20,
    gap: 12,
  },
});
