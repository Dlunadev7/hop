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
import {
  BookingData,
  BookingResponse,
} from "@/utils/interfaces/booking.interface";
import dayjs from "dayjs";
import { useSocket } from "@/hooks/use-socket.hook";
import useSWR from "swr";
import { getUserLogged } from "@/services/auth.service";
import { travelStatus } from "@/utils/enum/travel.enum";
import { TravelNotification } from "@/utils/interfaces/booking.notification.interface";
import { getTravelById, updateTravel } from "@/services/book.service";
import { router } from "expo-router";

type VehicleIconMap = {
  [key: string]: JSX.Element;
};

type CombinedType = Pick<TravelNotification, "metadata"> & {
  hopper: { id: string };
};

export const Step4Booking = (props: {
  formattedTime: string;
  formattedDate: string;
  setStepper: React.Dispatch<React.SetStateAction<number>>;
  data: BookingData;
  updateBookingData: React.Dispatch<React.SetStateAction<any>>;
  date: string;
}) => {
  const {
    formattedTime,
    formattedDate,
    setStepper,
    data,
    updateBookingData,
    date: dateProgrammed,
  } = props;
  const { t } = useTranslation();
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

  const travelId = data.id;

  const socket = useSocket("https://hop.api.novexisconsulting.xyz");

  useEffect(() => {
    if (!socket || !travelId) return;

    const eventName = `travel-${travelId}`;

    if (!socket.connected) {
      socket.connect();
    }

    socket.on(eventName, (message: CombinedType) => {
      if (message.metadata.travel.status !== travelStatus.REQUEST) {
        updateBookingData((prevState: BookingData) => ({
          ...prevState,
          hopperId: message.hopper.id,
        }));
      }
    });
  }, [socket, travelId]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getTravelById(travelId);

      if (response.status !== travelStatus.REQUEST) {
        setStepper(5);
        updateBookingData((prevState: BookingData) => ({
          ...prevState,
          hopperId: response.hopper.id,
        }));
      }
    };

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [travelId]);

  return (
    <VStack space="md" className="items-center gap-8 grow justify-between">
      <Box className="items-center gap-8 mt-4">
        <Text fontSize={24} fontWeight={400} textAlign="center">
          {t("home.map_home.fourthy_sheet.title", { ns: "home" })}
        </Text>

        <WaitingHopper width={200} height={200} />
        <Text
          fontSize={20}
          fontWeight={400}
          textColor={Colors.GRAY}
          textAlign="center"
        >
          {t("home.map_home.third_sheet.text", { ns: "home" })}
        </Text>
      </Box>
      {/* <Box className="gap-2">
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
      </Box> */}
      <Box className="w-full gap-4 mt-4">
        <Button
          onPress={() => {
            router.back();
          }}
          stretch
        >
          {t("home.map_home.third_sheet.search", { ns: "home" })}
        </Button>
        <Button
          onPress={() => {
            updateTravel(travelId, {
              status: travelStatus.CANCELLED,
            });
            router.back();
          }}
          type="ghost"
          stretch
          textClassName={{
            color: Colors.GRAY,
          }}
        >
          {t("home.map_home.third_sheet.cancel", { ns: "home" })}
        </Button>
      </Box>
    </VStack>
  );
};
