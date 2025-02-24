import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
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
import useSWR from "swr";
import { getUserLogged } from "@/services/auth.service";
import { getTravels } from "@/services/book.service";
import { userRoles } from "@/utils/enum/role.enum";
import dayjs from "dayjs";
import { router } from "expo-router";
import { travelTypeValues } from "@/utils/enum/travel.enum";
import { formattedDate } from "@/helpers/parse-date";
import { status } from "@/helpers/parser-names";

export const Booking = () => {
  const { t } = useTranslation();

  const { data: dataUser } = useSWR("/user/logged", getUserLogged);
  const [isDataTrue, setIsDataTrue] = useState<boolean | null>(null);

  const [page, setPage] = useState(0);
  const [bookingDataPaginated, setBookingDataPaginated] = useState<any[]>([]);

  const { data, error, isLoading } = useSWR(
    ["/travels/bookings", page],
    () =>
      getTravels(
        dataUser?.id,
        dataUser?.role === userRoles.USER_HOPPER ? "hopper" : "hoppy",
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
    if (data?.result) {
      setPage(0);
    }
  }, [data?.result]);

  useEffect(() => {
    if (data?.result) {
      setBookingDataPaginated((prevData) => {
        const newData = prevData.filter((existingItem) =>
          data.result.some((newItem) => newItem.id === existingItem.id)
        );

        data.result.forEach((newItem) => {
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
  }, [data?.result]);

  const handleEndReached = () => {
    if (
      data?.pagination &&
      data.pagination.page < data.pagination.totalPages - 1
    ) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (isLoading === false && isDataTrue === true) {
      setIsDataTrue(false);
    } else if (isLoading === true) {
      setIsDataTrue(true);
    }
  }, [data]);

  return (
    <View style={styles.bookings}>
      <Text fontSize={18} fontWeight={400} textColor={Colors.DARK_GREEN}>
        {t("home.booking.title", { ns: "home" })}
      </Text>
      <FlatList
        data={bookingDataPaginated}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        renderItem={({ item }: any) => {
          const { date, time } = formattedDate(item.programedTo);

          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(booking)/[id]",
                  params: { id: item.id },
                })
              }
              className="min-w-[350]"
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
                <HStack style={styles.card_description}>
                  <BookingSVG />
                  <Box className="gap-1 ">
                    <Text
                      fontSize={20}
                      fontWeight={600}
                      textColor={Colors.DARK_GREEN}
                    >
                      {status[item.type as travelTypeValues]}
                    </Text>
                    <Box className="flex-row gap-2 shrink-1 max-w-[250] pr-2">
                      <Routing />
                      <Text fontSize={16} fontWeight={400} maxLength={5}>
                        {item.from.address} - {item.to.address}
                      </Text>
                    </Box>
                    <Box className="flex-row gap-2">
                      <UserSquare />
                      <Text fontSize={16} fontWeight={400}>
                        {item.passengerName}
                      </Text>
                    </Box>
                    <Text
                      textColor={Colors.GRAY}
                      fontSize={14}
                      fontWeight={400}
                    >
                      Aerolinea Chile , Num. de Vuelo {item.passengerFligth}
                    </Text>
                  </Box>
                </HStack>
              </Card>
            </Pressable>
          );
        }}
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
