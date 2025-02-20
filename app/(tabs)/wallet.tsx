import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Container, Header, LineChartComponent } from "@/components";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/text/text.component";
import { Box } from "@/components/ui/box";
import {
  ArrowLeftFilled,
  ArrowRightFilled,
  ClockCustom,
  MockupChart1,
  MockupChart2,
  SuccessRounded,
  TrendDown,
  TrendUp,
} from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import {
  FlatList,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { ProfileRoutesLink } from "@/utils/enum/profile.routes";
import useSWR from "swr";
import { travelTypeValues } from "@/utils/enum/travel.enum";
import { getTravels } from "@/services/book.service";
import { getUserLogged } from "@/services/auth.service";
import { userRoles } from "@/utils/enum/role.enum";
import dayjs from "dayjs";

const images = [
  {
    src: <MockupChart1 />,
    label: "Jan/Jun - 2025",
    trend: <TrendUp />,
    trendNum: "+10",
    accumulated: 7.601,
  },
  {
    src: <MockupChart2 />,
    label: "Jul/Dec - 2025",
    trend: <TrendDown />,
    trendNum: "-2",
    accumulated: 4.227,
  },
];

export default function Wallet() {
  const { t } = useTranslation();
  const navigator = useNavigation();

  const [index, setIndex] = useState(0);

  const changeImage = (direction: "left" | "right") => {
    setIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
  };

  const swipeGesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX > 50) {
      runOnJS(changeImage)("right");
    } else if (event.translationX < -50) {
      runOnJS(changeImage)("left");
    }
  });

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          title={t("title", { ns: "wallet" })}
          menu
          onPressMenu={() => router.push(ProfileRoutesLink.BANK_ACCOUNT)}
        />
      ),
    });
  }, []);

  const [page, setPage] = useState(0);
  const [bookingDataPaginated, setBookingDataPaginated] = useState<any[]>([]);
  const { data: dataUser } = useSWR("/user/logged", getUserLogged);

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

        const updatedData = newData.filter((item) =>
          data.result.some((newItem) => newItem.id === item.id)
        );

        return updatedData;
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

  const status: Record<travelTypeValues, string> = {
    PICKUP: "Pick Up",
    DROPOFF: "Drop Off",
    PROGRAMED: "Programmed",
    INSTANT: "",
  };

  const dataChart = [50, 10, 40, 95, 85, 91, 35, 53, 24, 0];

  const formattedDate = (date: Date) => ({
    date: dayjs(date).utc(false).format("DD MMM. YYYY"),
    time: dayjs(date).utc(false).format("HH:mm A"),
  });

  const statusPriceColor: Record<travelTypeValues, string> = {
    PICKUP: Colors.PRIMARY,
    DROPOFF: Colors.PRIMARY,
    PROGRAMED: Colors.LIGHT_YELLOW,
    INSTANT: "",
  };

  const renderItem = ({ item }: any) => {
    const { date, time } = formattedDate(item.programedTo);
    const translatedStatus = status[item.type as travelTypeValues] || item.type;

    return (
      <HStack
        style={styles.item}
        key={item.id}
        className="justify-between items-center mt-3"
      >
        <VStack>
          <Text fontSize={20} fontWeight={600} textColor={Colors.DARK_GREEN}>
            {translatedStatus}
          </Text>
          <Text fontSize={14} fontWeight={400} textColor={Colors.DARK_GREEN}>
            {date} - {time}
          </Text>
        </VStack>
        <Badge
          style={{
            backgroundColor: statusPriceColor[item.type as travelTypeValues],
          }}
          className="rounded-full gap-2"
        >
          {translatedStatus === "Programmed" ? (
            <ClockCustom color={Colors.YELLOW} width={24} height={24} />
          ) : (
            <Icon as={SuccessRounded} style={{ width: 24, height: 24 }} />
          )}
          <Text fontSize={14} fontWeight={400} textColor={Colors.DARK_GREEN}>
            ${item.price ? Number(item.price).toFixed(2) : 0}
          </Text>
        </Badge>
      </HStack>
    );
  };

  return (
    <Container>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={swipeGesture}>
          <View style={{ flex: 1 }} collapsable={false}>
            <Box className="mt-7 flex-row justify-between">
              <Pressable onPress={() => changeImage("left")}>
                <ArrowLeftFilled />
              </Pressable>
              <Text
                fontSize={20}
                fontWeight={600}
                textColor={Colors.DARK_GREEN}
              >
                {images[index]?.label}
              </Text>
              <Pressable onPress={() => changeImage("right")}>
                <ArrowRightFilled />
              </Pressable>
            </Box>
            <Box className="mt-6">
              <Text
                textAlign="center"
                fontSize={16}
                fontWeight={400}
                textColor={Colors.DARK_GREEN}
              >
                {t("total", { ns: "wallet" })}
              </Text>
            </Box>
            <VStack className="items-center mt-7">
              <Text
                fontSize={32}
                fontWeight={600}
                textColor={Colors.DARK_GREEN}
              >
                ${images[index].accumulated}
              </Text>
              <LineChartComponent
                data={dataChart}
                strokeColor={Colors.PRIMARY}
                height={250}
              />
            </VStack>

            <Box className="mt-3 items-end">
              <HStack className="items-center">
                <Text
                  fontSize={16}
                  fontWeight={400}
                  textColor={index === 0 ? Colors.SECONDARY : Colors.ERROR}
                >
                  {images[index].trendNum}%
                </Text>
                {images[index].trend}
              </HStack>
              <Text fontSize={12} fontWeight={300} textColor={Colors.GRAY}>
                {t("prev_month", { ns: "wallet" })}
              </Text>
            </Box>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
      <Box className="mt-6">
        <Text fontSize={18} fontWeight={400} textColor={Colors.DARK_GREEN}>
          {t("last_comissions", { ns: "wallet" })}
        </Text>
        <FlatList
          data={bookingDataPaginated}
          renderItem={renderItem}
          keyExtractor={(item: { id: string }) => item.id.toString()}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150, gap: 12 }}
          ListFooterComponent={isLoading ? <Text>Loading more...</Text> : <></>}
          nestedScrollEnabled
        />
      </Box>
    </Container>
  );
}

const styles = StyleSheet.create({
  item: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.SECONDARY,
    backgroundColor: Colors.LIGHT_GRADIENT_1,
    padding: 10,
  },
});
