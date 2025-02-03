import React, { useEffect, useState } from "react";
import { VStack } from "../ui/vstack";
import { Text } from "../text/text.component";
import {
  CalendarActive,
  ClockActive,
  ElectricCar,
  Sedan,
  Van,
  WaitingHopper,
} from "@/assets/svg";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Colors } from "@/constants/Colors";
import { Button } from "../button/button.component";
import { useTranslation } from "react-i18next";
import { BookingData } from "@/utils/interfaces/booking.interface";
import dayjs from "dayjs";
import capitalizeWords from "@/helpers/capitalize-words";

type VehicleIconMap = {
  [key: string]: JSX.Element;
};

export const Step4Booking = (props: {
  formattedTime: string;
  formattedDate: string;
  setStepper: React.Dispatch<React.SetStateAction<number>>;
  data: BookingData;
  date: string;
}) => {
  const {
    formattedTime,
    formattedDate,
    setStepper,
    data,
    date: dateProgrammed,
  } = props;
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setStepper(5);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const vehicleTypeIcon = [
    {
      type: "vans",
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

  const formattedDateFN = (date: Date) => ({
    date: dayjs(date).format("DD MMM. YYYY"),
    time: dayjs(date).format("HH:mm A"),
  });

  const { date, time } = formattedDateFN(
    dateProgrammed ? dateProgrammed : data.programedTo
  );

  const vehicleName: { [key: string]: string } = {
    SEDAN: "Sedan",
    VANS: "Van",
    ELECTRIC: "Electric Car",
  };

  return (
    <VStack space="md" className="items-center gap-8">
      <Text fontSize={24} fontWeight={400} textAlign="center">
        {t("home.map_home.fourthy_sheet.title", { ns: "home" })}
      </Text>

      <WaitingHopper width={200} height={200} />
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
            ({data.numberOfPassengers}{" "}
            {Number(data.numberOfPassengers) > 1
              ? t("booking.card.passengers", { ns: "booking" })
              : t("booking.card.passenger", { ns: "booking" })}
            )
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
            {date ? date : formattedDate}
          </Text>
          <ClockActive width={28} height={28} />
          <Text fontSize={16} fontWeight={400}>
            {time ? time : formattedTime}
          </Text>
        </HStack>
      </Box>
      <Button onPress={() => setStepper(5)} stretch>
        {t("home.map_home.third_sheet.cancel", { ns: "home" })}
      </Button>
    </VStack>
  );
};
