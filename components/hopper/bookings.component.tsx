import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
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
import useSWR from "swr";
import { getTravels } from "@/services/book.service";
import { userRoles } from "@/utils/enum/role.enum";
import { getUserLogged } from "@/services/auth.service";
import Advice from "./advice.component";
import { TravelNotification } from "@/utils/interfaces/booking.notification.interface";
import {
  BookingData,
  BookingResponseNotification,
} from "@/utils/interfaces/booking.interface";

export const BookingsHopper = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);

  const [bookingDataPaginated, setBookingDataPaginated] = useState<any[]>([]);

  const { data, error } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
  });

  const { data: travel, isLoading } = useSWR(
    ["/travels/bookings", page],
    () =>
      getTravels(
        data?.id,
        data?.role === userRoles.USER_HOPPER ? "hopper" : "hoppy",
        true,
        false,
        page
      ),
    {
      refreshInterval: 1000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    }
  );
  useEffect(() => {
    if (travel?.result) {
      setPage(0);
    }
  }, [travel?.result]);

  useEffect(() => {
    if (travel?.result) {
      setBookingDataPaginated((prevData) => {
        const newData = [...prevData];
        travel.result.forEach((newItem) => {
          const existingItemIndex = newData.findIndex(
            (existingItem) => existingItem.id === newItem.id
          );

          if (existingItemIndex !== -1) {
            newData[existingItemIndex] = newItem;
          } else {
            newData.push(newItem);
          }
        });

        return newData;
      });
    }
  }, [travel?.result]);

  const handleEndReached = () => {
    if (
      travel?.pagination &&
      travel.pagination.page < travel.pagination.totalPages - 1
    ) {
      setPage(page + 1);
    }
  };

  return (
    <View className="mt-6">
      <Text fontSize={16} fontWeight={400} textColor={Colors.DARK_GREEN}>
        {t("home.hopper.bookings.title", { ns: "home" })}
      </Text>
      {bookingDataPaginated?.length > 0 ? (
        <FlatList
          data={bookingDataPaginated}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          className="mt-4"
          contentContainerClassName="gap-2"
          showsHorizontalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          renderItem={({
            item,
            index,
          }: {
            item: BookingResponseNotification;
            index: number;
          }) => {
            const { date, time } = formattedDate(item?.programedTo);

            return (
              <Pressable
                className="min-w-[350]"
                key={index}
                onPress={() =>
                  router.push({
                    pathname: HomeRoutesLink.MAP_HOPPER,
                    params: {
                      travel: JSON.stringify(item),
                    },
                  })
                }
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
                        {status[item.type as travelTypeValues]}
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
                        {item.from.address} - {item.to.address}
                      </Text>
                    </Box>
                    <Box className="flex-row gap-2">
                      <UserSquare />
                      <Text
                        fontSize={16}
                        textColor={Colors.GRAY}
                        fontWeight={400}
                      >
                        {item.hoppy.userInfo.firstName}{" "}
                        {item.hoppy.userInfo.lastName}
                      </Text>
                    </Box>
                    <Box className="flex-row gap-2">
                      <MessageActive />
                      <Text
                        fontSize={16}
                        textColor={Colors.GRAY}
                        fontWeight={400}
                      >
                        {item.passengerContactCountryCode}{" "}
                        {item.passengerContact}
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
                          ${item.price?.toFixed(2)}
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
        <>
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
          <Advice />
        </>
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
