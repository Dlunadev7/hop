import { View } from "react-native";
import React from "react";
import { VStack } from "../ui/vstack";
import { Text } from "../text/text.component";
import {
  AvatarHopper,
  CalendarActive,
  ClockActive,
  ElectricCar,
  Sedan,
  Star,
  Ticket,
  Van,
} from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Button } from "../button/button.component";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { HomeRoutesLink } from "@/utils/enum/home.routes";
import { BookingData } from "@/utils/interfaces/booking.interface";
import dayjs from "dayjs";
import capitalizeWords from "@/helpers/capitalize-words";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type VehicleIconMap = {
  [key: string]: JSX.Element;
};

export const Step5Booking = (props: {
  formattedDate: string;
  formattedTime: string;
  data: BookingData;
  date: string;
}) => {
  const { t } = useTranslation();
  const { formattedDate, formattedTime, data, date: dateProgrammed } = props;

  const date = dayjs(data.programedTo);

  const TIME = date.format("DD MMM. YYYY");
  const HOUR = date.format("HH:mm");

  const vehicleTypeIcon = [
    {
      type: "vans",
      name: "Van",
      icon: <Van width={35} height={35} />,
    },
    {
      type: "sedan",
      icon: <Sedan width={35} height={35} />,
    },
    {
      type: "electric",
      icon: <ElectricCar width={35} height={35} />,
    },
  ];

  const vehicleIconMap = vehicleTypeIcon.reduce((acc, item) => {
    acc[item.type.toUpperCase()] = item.icon;
    return acc;
  }, {} as VehicleIconMap);

  const carType = data.carType.toUpperCase();
  const Icon = vehicleIconMap[carType] || null;

  const formattedDateFN = (date: Date | string) => ({
    date: dayjs(date).utc(true).format("DD MMM. YYYY"),
    time: dayjs(date).utc(true).format("HH:mm A"),
  });

  const { date: parsedFormattedDate, time } = formattedDateFN(
    data.programedTo ? data.programedTo : dateProgrammed
  );

  const vehicleName: { [key: string]: string } = {
    SEDAN: "Sedan",
    VANS: "Van",
    ELECTRIC: "Electric Car",
  };

  return (
    <VStack space="md" className="items-center gap-8">
      <Text fontSize={24} fontWeight={400} textAlign="center">
        Maria Victoria{" "}
        {t("home.map_home.fifty_sheet.accept_reservation", { ns: "home" })}
      </Text>

      <VStack className="items-center gap-2">
        <AvatarHopper width={120} height={120} />
        <View className="flex-row gap-2">
          {[0, 1, 2, 3].map((_, index) => (
            <Star key={index} />
          ))}
        </View>
        <Text textColor={Colors.GRAY}>
          123 {t("home.map_home.fifty_sheet.trips", { ns: "home" })}
        </Text>
        <Text textColor={Colors.SECONDARY} fontWeight={400}>
          Hopper Deluxe
        </Text>
      </VStack>
      <Box className="gap-2">
        <HStack
          className="rounded-full py-2 px-6 items-center gap-2"
          style={{
            backgroundColor: Colors.LIGHT_GRADIENT_1,
            height: 44,
            width: 300,
          }}
        >
          {Icon}
          <Text fontSize={16} fontWeight={400}>
            {vehicleName[data?.carType!]}
          </Text>
          <Text textColor={Colors.GRAY} fontWeight={400}>
            {data.numberOfPassengers} -{" "}
            {Number(data.numberOfPassengers) > 1
              ? t("booking.card.passengers", { ns: "booking" })
              : t("booking.card.passenger", { ns: "booking" })}
          </Text>
        </HStack>
        <HStack
          className="rounded-full py-2 px-6 items-center gap-2"
          style={{
            backgroundColor: Colors.LIGHT_GRADIENT_1,
            height: 44,
            width: 300,
          }}
        >
          <CalendarActive width={28} height={28} />
          <Text fontSize={16} fontWeight={400}>
            {parsedFormattedDate ? parsedFormattedDate : TIME}
          </Text>
          <ClockActive width={28} height={28} />
          <Text fontSize={16} fontWeight={400}>
            {time ? time : HOUR}
          </Text>
        </HStack>
        <HStack
          className="rounded-full py-2 px-6 items-center gap-2"
          style={{
            backgroundColor: Colors.LIGHT_GRADIENT_1,
            height: 44,
            width: 300,
          }}
        >
          <Ticket width={35} height={35} />
          <Text fontSize={16} fontWeight={400}>
            {t("home.map_home.fifty_sheet.value", { ns: "home" })}
          </Text>
          <Text textColor={Colors.GRAY} fontWeight={400}>
            ${data.price ? data.price.toFixed(2) : 0}
          </Text>
        </HStack>
      </Box>
      <Button
        onPress={() =>
          router.replace({
            pathname: HomeRoutesLink.CONFIRMATION,
            params: {
              commission: data.hoppyCommission,
            },
          })
        }
        stretch
      >
        {t("home.map_home.fourthy_sheet.confirm", { ns: "home" })}
      </Button>
    </VStack>
  );
};
