import React, { ReactElement, useEffect, useState } from "react";
import { Container, Header } from "@/components";
import { Text } from "@/components/text/text.component";
import { router, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Colors } from "@/constants/Colors";
import { Box } from "@/components/ui/box";
import {
  Clock,
  ClockCustom,
  DolarCircle,
  Routing,
  Ticket,
  UserSquare,
} from "@/assets/svg";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  VirtualizedList,
} from "react-native";
import { Badge } from "@/components/ui/badge";
import useSWR, { mutate } from "swr";
import { getTravels } from "@/services/book.service";
import { getUserLogged } from "@/services/auth.service";
import { userRoles } from "@/utils/enum/role.enum";
import dayjs from "dayjs";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { FlatList } from "react-native-gesture-handler";
import { travelTypeValues } from "@/utils/enum/travel.enum";
import { CheckCircleIcon, CloseCircleIcon, Icon } from "@/components/ui/icon";

const BookingCardSkeleton = () => {
  return (
    <Box className="w-full gap-4 p-3 rounded-md bg-background-100">
      <Skeleton variant="sharp" className="h-[150px]" />
      <SkeletonText _lines={3} className="h-3" />
      <HStack className="gap-2 align-middle">
        <Skeleton variant="circular" className="h-[24px] w-[24px] mr-2" />
        <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
      </HStack>
    </Box>
  );
};
export default function History() {
  const navigator = useNavigation();
  const { t } = useTranslation();
  const { data: dataUser } = useSWR("/user/logged", getUserLogged);
  const [page, setPage] = useState(0);
  const [bookingDataPaginated, setBookingDataPaginated] = useState<any[]>([]);

  const { data, isLoading } = useSWR(
    ["/travels/history", page],
    async () => {
      const response = await getTravels(
        dataUser?.id,
        dataUser?.role === userRoles.USER_HOPPER ? "hopper" : "hoppy",
        false,
        true,
        page
      );
      return response;
    },
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
    navigator.setOptions({
      header: () => <Header title={t("title", { ns: "history" })} />,
      gestureEnabled: false,
    });
  }, [navigator]);

  const handleEndReached = () => {
    if (
      data?.pagination &&
      data.pagination.page < data.pagination.totalPages - 1
    ) {
      setPage(page + 1);
    }
  };

  const formattedDate = (date: Date) => ({
    date: dayjs(date).format("DD MMM. YYYY"),
    time: dayjs(date).format("HH:mm A"),
  });

  const type: Record<travelTypeValues, string> = {
    PICKUP: "Pick Up",
    DROPOFF: "Drop Off",
    PROGRAMED: "Programmed",
    INSTANT: "",
  };

  const status: { [key: string]: string } = {
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    START: "In Progress",
    END: "Completed",
  };

  const statusColor: { [key: string]: string } = {
    COMPLETED: Colors.VIOLET,
    CANCELLED: Colors.ERROR,
    START: Colors.YELLOW,
    END: Colors.VIOLET,
  };

  const iconStatus: { [key: string]: ReactElement } = {
    COMPLETED: (
      <Icon as={CheckCircleIcon} color={Colors.VIOLET} width={16} height={16} />
    ),
    END: (
      <Icon as={CheckCircleIcon} color={Colors.VIOLET} width={16} height={16} />
    ),
    CANCELLED: (
      <Icon as={CloseCircleIcon} color={Colors.ERROR} width={16} height={16} />
    ),
    START: <ClockCustom color={Colors.YELLOW} width={16} height={16} />,
  };

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
  }, [data?.result, page]);

  return (
    <View style={styles.container}>
      <View style={styles.content} className="px-4 ">
        <FlatList
          data={bookingDataPaginated}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3"
          contentContainerStyle={{ paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const { date } = formattedDate(item.programedTo);

            const translatedStatus =
              type[item.type as travelTypeValues] || item.type;

            const currentStatus = status[item.status as any] || item.status;

            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(history)/[id]",
                    params: {
                      id: item.id,
                    },
                  })
                }
              >
                <Card variant="outline" style={styles.card}>
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
                      <Text
                        fontSize={12}
                        fontWeight={400}
                        textColor={Colors.GRAY}
                      >
                        {date}
                      </Text>
                    </Box>
                    <Box className="flex-row gap-2 items-center">
                      <Text
                        fontSize={14}
                        fontWeight={600}
                        textColor={statusColor[item.status]}
                      >
                        {currentStatus}
                      </Text>
                      {iconStatus[item.status]}
                    </Box>
                  </HStack>
                  <HStack style={styles.card_description}>
                    <Box className="gap-1">
                      <Box className="flex-row gap-2 flex-wrap">
                        <Routing />
                        <Text
                          fontSize={16}
                          fontWeight={400}
                          textColor={Colors.SECONDARY}
                          className="w-[80%]"
                        >
                          {item.from.address} - {item.to.address}
                        </Text>
                      </Box>
                      <Box className="flex-row gap-2">
                        <UserSquare />
                        <Text
                          fontSize={16}
                          fontWeight={400}
                          textColor={Colors.SECONDARY}
                        >
                          {item.passengerName}
                        </Text>
                      </Box>
                      <Box className="flex-row gap-2">
                        <Ticket width={24} height={24} />
                        <Text
                          fontSize={16}
                          fontWeight={400}
                          textColor={Colors.SECONDARY}
                        >
                          Valor ${item.price ? item.price.toFixed(2) : "0"}
                        </Text>
                      </Box>
                    </Box>
                  </HStack>
                  <Badge style={styles.badge}>
                    <DolarCircle />
                    <Text
                      fontSize={18}
                      fontWeight={600}
                      textColor={Colors.DARK_GREEN}
                    >
                      ${item.price ? item.price.toFixed(2) : "0"}
                    </Text>
                  </Badge>
                </Card>
              </Pressable>
            );
          }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? <ActivityIndicator color={Colors.WHITE} /> : null
          }
          nestedScrollEnabled={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    flexGrow: 1,
  },
  bookings: {
    marginTop: 32,
    gap: 12,
  },
  card: {
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    borderRadius: 20,
  },
  card_description: {
    marginTop: 20,
    gap: 12,
    backgroundColor: Colors.LIGHT_GRADIENT_1,
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
