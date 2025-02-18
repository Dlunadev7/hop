import { Pressable, Keyboard, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Text } from "../text/text.component";
import { useTranslation } from "react-i18next";
import { Box } from "../ui/box";
import { Switch } from "../switch/switch.component";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { carOptions } from "@/helpers/car-options";
import { Divider } from "../ui/divider";
import { BookingData } from "@/utils/interfaces/booking.interface";
import { createTravel } from "@/services/book.service";
import useSWR from "swr";
import { getUserLogged } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { travelStatus, travelTypeValues } from "@/utils/enum/travel.enum";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
export const Step3Booking = (props: {
  setStepper: React.Dispatch<React.SetStateAction<number>>;
  updateBookingData: any;
  data: BookingData;
  date: string;
}) => {
  const { data } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const { t } = useTranslation();
  const { setStepper, date } = props;
  const { updateBookingData, data: dataPayload } = props;
  const [toggleSwitch, setToggleSwitch] = useState(
    dataPayload?.reducedMobility
  );

  const options = carOptions(t);
  const parsedDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  const convertToDate = (dateString: string) => {
    return dayjs(dateString).utc(true).toDate();
  };
  const formattedDate = convertToDate(dataPayload.programedTo);

  const handleBookHopper = async (carType: string) => {
    setIsLoading(true);
    try {
      const response = await createTravel({
        from: {
          lat: dataPayload.currentLocation.latitude!,
          lng: dataPayload.currentLocation.longitude!,
          address: dataPayload.currentLocation.address!,
        },
        to: {
          lat: dataPayload.destination.latitude!,
          lng: dataPayload.destination.longitude!,
          address: dataPayload.destination.address!,
        },
        distance: dataPayload.distance,
        time: dataPayload.time,
        vehicleType: carType,
        programedTo: dataPayload.programedTo
          ? formattedDate
          : convertToDate(parsedDate),
        status: travelStatus.REQUEST,
        passengerName: dataPayload.fullName,
        passengerContact: dataPayload.contact,
        passengerRoom: dataPayload.roomNumber,
        passengerContactCountryCode: dataPayload.countryCode,
        totalPassengers: dataPayload.numberOfPassengers.toString(),
        totalSuitCases: dataPayload.numberOfLuggages.toString(),
        passengerAirline: dataPayload.airline,
        passengerFligth: dataPayload.flightNumber,
        hoppy: {
          id: data?.id!,
        },
        type: dataPayload.type as travelTypeValues,
      });

      console.log(JSON.stringify(response, null, 2));

      updateBookingData((prevState: BookingData) => ({
        ...prevState,
        carType: carType,
        price: response.price,
        hoppyCommission: response.hoppyCommission,
        id: response.id,
      }));

      setStepper(4);
    } catch (error) {
      console.log(error);
      showToast({
        message: t("server_error", { ns: "utils" }),
        action: "error",
        duration: 3000,
        placement: "bottom",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      style={{
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 16,
      }}
      onPress={() => Keyboard.dismiss()}
    >
      <Text fontSize={24} fontWeight={400}>
        {t("home.map_home.third_sheet.title", { ns: "home" })}
      </Text>

      <Box className="flex-row mt-6 items-center gap-2 mb-6">
        <Switch
          isOn={toggleSwitch}
          onToggleSwitch={() => {
            setToggleSwitch(!toggleSwitch);
            updateBookingData((prevState: any) => ({
              ...prevState,
              reducedMobility: !toggleSwitch,
            }));
          }}
        />
        <Text fontSize={12} fontWeight={300}>
          {t("home.map_home.third_sheet.accessibility", {
            ns: "home",
          })}
        </Text>
      </Box>

      <VStack space="md" className="mb-6">
        {options.map(({ name, icon: Icon, value }) => (
          <Pressable
            onPress={() => {
              handleBookHopper(value);
            }}
            disabled={isLoading}
            key={name}
          >
            <HStack space="md" className="items-center">
              <Icon height={85} />
              <VStack space="md">
                <Text
                  fontSize={20}
                  fontWeight={400}
                  textColor={Colors.DARK_GREEN}
                >
                  {name}
                </Text>
                {/* <Box className="gap-2 flex-row items-center">
                  <ProfileActive width={16} height={16} />
                  <Text fontSize={14} fontWeight={400} textColor={Colors.GRAY}>
                    {passengers}
                  </Text>
                </Box>
                <Box className="gap-2 flex-row items-center">
                  <Luggage width={16} height={16} />
                  <Text fontSize={14} fontWeight={400} textColor={Colors.GRAY}>
                    {luggage}
                  </Text>
                </Box> */}
              </VStack>
            </HStack>
            <Divider
              style={[
                styles.divider,
                { backgroundColor: Colors.LIGHT_GRADIENT_1 },
              ]}
              className="mt-2"
            />
          </Pressable>
        ))}
      </VStack>
      {/* <Button
        onPress={() => {
          handleBookHopper();
        }}
        stretch
      >
        {t("home.next", { ns: "home" })}
      </Button> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: Colors.PRIMARY,
  },
});
