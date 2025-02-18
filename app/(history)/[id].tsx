import React, { useEffect } from "react";
import { router, useNavigation } from "expo-router";
import { Container, Header } from "@/components";
import { travelTypeValues } from "@/utils/enum/travel.enum";
import useSWR from "swr";
import { useRoute } from "@react-navigation/native";
import { getTravelById } from "@/services/book.service";
import { Text } from "@/components/text/text.component";
import dayjs from "dayjs";
import { Colors } from "@/constants/Colors";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { ProfileActive, ReserveFilled, Routing } from "@/assets/svg";
import { StyleSheet, View } from "react-native";
import { Badge } from "@/components/ui/badge";
import { VStack } from "@/components/ui/vstack";
import { useTranslation } from "react-i18next";
import { getUserLogged } from "@/services/auth.service";
import { userRoles } from "@/utils/enum/role.enum";

export default function History() {
  const { id } = useRoute().params as { id: string };
  const navigator = useNavigation();
  const { t } = useTranslation();
  const { data: user } = useSWR("/user/logged", getUserLogged);
  const { data } = useSWR("/travel/one", () => getTravelById(id), {
    revalidateOnMount: true,
  });

  const type: Record<travelTypeValues, string> = {
    PICKUP: "Pick Up",
    DROPOFF: "Drop Off",
    PROGRAMED: "Programmed",
    INSTANT: "",
  };

  const translatedStatus = type[data?.type as travelTypeValues] || data?.type;

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          title={translatedStatus ?? ""}
          arrow
          onPressArrow={() => router.back()}
        />
      ),
      gestureEnabled: false,
    });
  }, [navigator]);

  const formattedDate = (date: Date) => ({
    date: dayjs(date).format("DD MMM. YYYY"),
    time: dayjs(date).format("HH:mm A"),
  });

  const { date, time } = formattedDate(data?.programedTo!);

  return (
    <Container>
      <Text textColor={Colors.DARK_GREEN} fontSize={18} fontWeight={600}>
        {date} - {time}
      </Text>
      <HStack style={styles.card_description}>
        <Box className="gap-1">
          <Box className="flex-row gap-2 flex-wrap">
            <Routing />
            <Text fontSize={16} fontWeight={400} className="w-[80%]">
              {data?.from.address} - {data?.to.address}
            </Text>
          </Box>
          <Box className="flex-row gap-2">
            <ProfileActive />
            <Text fontSize={16} fontWeight={400}>
              {`${data?.hopper?.userInfo.firstName ?? ""} ${
                data?.hopper?.userInfo.lastName ?? ""
              }`}
            </Text>
          </Box>
          <Box className="flex-row gap-2">
            <ReserveFilled width={24} height={24} />
            <Text fontSize={16} fontWeight={400}>
              {data?.passengerName}
            </Text>
          </Box>
        </Box>
      </HStack>
      <VStack className="mt-8 gap-2">
        <Text textColor={Colors.DARK_GREEN} fontSize={18} fontWeight={400}>
          {t("service_detail", { ns: "history" })}
        </Text>
        <Badge className="bg-[#E1F5F3] rounded-md justify-between">
          <Text fontSize={16} fontWeight={400} textColor={Colors.DARK_GREEN}>
            {t("trip_value", { ns: "history" })}
          </Text>
          <Text fontSize={16} fontWeight={400} textColor={Colors.DARK_GREEN}>
            ${data?.price?.toFixed(2) ?? 0}
          </Text>
        </Badge>
        <Badge className="bg-[#E1F5F3] rounded-md justify-between">
          <Text fontSize={16} fontWeight={400} textColor={Colors.DARK_GREEN}>
            {t("service_fees", { ns: "history" })}
          </Text>
          <Text fontSize={16} fontWeight={400} textColor={Colors.DARK_GREEN}>
            -${data?.appCommission?.toFixed(2) ?? 0}
          </Text>
        </Badge>
        <Badge className="bg-[#E1F5F3] rounded-md justify-between">
          <Text fontSize={16} fontWeight={400} textColor={Colors.DARK_GREEN}>
            {t("tolls", { ns: "history" })}
          </Text>
          <Text fontSize={16} fontWeight={400} textColor={Colors.DARK_GREEN}>
            -${data?.appCommission?.toFixed(2) ?? 0}
          </Text>
        </Badge>
      </VStack>
      <View className="h-auto bg-[#9FE4DD] mt-6 rounded-full flex-row justify-between py-1 px-2 items-center">
        <Text fontSize={20} fontWeight={400} textColor={Colors.DARK_GREEN}>
          {t("net_earnings", { ns: "history" })}
        </Text>
        <Text fontSize={28} fontWeight={600} textColor={Colors.DARK_GREEN}>
          $
          {user?.role === userRoles.USER_HOPPER
            ? data?.hopperCommission?.toFixed(2) ?? 0
            : data?.hoppyCommission?.toFixed(2) ?? 0}
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card_description: {
    marginTop: 20,
    gap: 12,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
});
