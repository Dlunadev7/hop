import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Container, Header } from "@/components";
import { Text } from "@/components/text/text.component";
import { router, useNavigation } from "expo-router";
import {
  Calendar,
  ClockCustom,
  Notification,
  Routing,
  Ticket,
  UserSquare,
} from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Button } from "@/components/button/button.component";
import { ArrowRightIcon, ChevronRightIcon, Icon } from "@/components/ui/icon";
import useSWR from "swr";
import { getUserLogged } from "@/services/auth.service";
import { getTravels } from "@/services/book.service";
import { userRoles } from "@/utils/enum/role.enum";
import dayjs from "dayjs";
import { travelTypeValues } from "@/utils/enum/travel.enum";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native-gesture-handler";
import utc from "dayjs/plugin/utc";
import { useAuth } from "@/context/auth.context";
dayjs.extend(utc);

export default function Booking() {
  const navigator = useNavigation();
  const { t } = useTranslation();
  const { data: dataUser } = useSWR("/user/logged", getUserLogged);
  const [page, setPage] = useState(0);
  const [bookingDataPaginated, setBookingDataPaginated] = useState<any[]>([]);
  const { token } = useAuth();
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
        const newData = [...prevData];
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

  const renderItem = ({ item }: any) => {
    const { date, time } = formattedDate(item.programedTo);
    const translatedStatus = status[item.type as travelTypeValues] || item.type;
    const vehicle = vehicleName[item.vehicleType];

    return (
      <Card variant="outline" style={styles.card} key={item.id}>
        <HStack className="gap-1 items-center justify-between">
          <Box>
            <Text
              className="items-center gap-2"
              textColor={Colors.DARK_GREEN}
              fontWeight={600}
              fontSize={20}
            >
              {translatedStatus}
            </Text>
            <Text fontSize={12} fontWeight={400} textColor={Colors.GRAY}>
              {vehicle} - {item.totalPassengers}{" "}
              {Number(item.totalPassengers) > 1
                ? t("booking.card.passengers", { ns: "booking" })
                : t("booking.card.passenger", { ns: "booking" })}
            </Text>
          </Box>
          <VStack>
            <Box className="flex-row gap-2 items-center">
              <Calendar width={16} />
              <Text
                fontSize={14}
                fontWeight={400}
                textColor={Colors.DARK_GREEN}
              >
                {date}
              </Text>
            </Box>
            <Text
              fontWeight={400}
              fontSize={14}
              textColor={Colors.DARK_GREEN}
              textAlign="right"
            >
              {time}
            </Text>
          </VStack>
        </HStack>
        <HStack style={styles.card_description}>
          <Box className="gap-1">
            <Box className="flex-row gap-2 flex-wrap">
              <Routing width={18} height={18} />
              <Text
                fontSize={14}
                fontWeight={400}
                textColor={Colors.SECONDARY}
                className="w-[80%]"
              >
                {item.from.address} - {item.to.address}
              </Text>
            </Box>
            <Box className="flex-row gap-2">
              <UserSquare width={18} height={18} />
              <Text fontSize={14} fontWeight={400} textColor={Colors.SECONDARY}>
                Hopper Name
              </Text>
            </Box>
            <Box className="flex-row gap-2">
              <Ticket width={18} height={18} />
              <Text fontSize={14} fontWeight={400} textColor={Colors.SECONDARY}>
                {item.passengerName}
              </Text>
            </Box>
          </Box>
        </HStack>
        <HStack className="mt-4 justify-between">
          <Button onPress={() => {}}>
            {t("booking.card.button", { ns: "booking" })}
          </Button>
          <Pressable
            className="w-[40px] h-[40px] bg-[#9FE4DD] rounded-xl items-center justify-center"
            onPress={() =>
              router.push({
                pathname: "/(booking)/[id]",
                params: { id: item.id },
              })
            }
          >
            <Icon
              as={ChevronRightIcon}
              style={{ width: 24, height: 24 }}
              color={Colors.SECONDARY}
            />
          </Pressable>
        </HStack>
      </Card>
    );
  };

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          title={t("booking.title", { ns: "booking" })}
          icon={<Notification />}
          onPressIcon={() => router.push("/notification/")}
        />
      ),
    });
  }, [navigator]);

  const formattedDate = (date: Date) => ({
    date: dayjs(date).utc(false).format("DD MMM. YYYY"),
    time: dayjs(date).utc(false).format("HH:mm A"),
  });

  const status: Record<travelTypeValues, string> = {
    PICKUP: "Pick Up",
    DROPOFF: "Drop Off",
    PROGRAMED: "Programmed",
  };

  const vehicleName: { [key: string]: string } = {
    SEDAN: "Sedan",
    VANS: "Van",
    ELECTRIC: "Electric Car",
  };

  return (
    <View style={styles.container}>
      <View style={styles.content} className="px-4 ">
        <FlatList
          data={bookingDataPaginated}
          renderItem={renderItem}
          keyExtractor={(item: { id: string }) => item.id.toString()}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150, gap: 12 }}
          ListFooterComponent={isLoading ? <Text>Loading more...</Text> : null}
          nestedScrollEnabled
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 32,
    gap: 16,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  bookings: {
    marginTop: 32,
    gap: 12,
  },
  card: {
    borderWidth: 0,
    borderRadius: 20,
    backgroundColor: Colors.LIGHT_GRADIENT_1,
    shadowColor: Colors.GRAY,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card_description: {
    marginTop: 20,
    gap: 12,
    backgroundColor: Colors.WHITE,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  badge: {
    alignSelf: "flex-end",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 40,
    marginTop: 12,
  },
});
