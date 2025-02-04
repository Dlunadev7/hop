import { View, Pressable, Keyboard, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BottomSheet } from "../sheet/sheet.component";
import { Colors } from "@/constants/Colors";
import { Text } from "../text/text.component";
import { useTranslation } from "react-i18next";
import { HStack } from "../ui/hstack";
import { Badge, BadgeIcon } from "../ui/badge";
import {
  CalendarActive,
  ClockActive,
  LocationFilled,
  Send,
} from "@/assets/svg";
import { VStack } from "../ui/vstack";
import Input from "../input/input.component";
import { Box } from "../ui/box";
import { Divider } from "../ui/divider";
import { Button } from "../button/button.component";
import useSWR from "swr";
import { getUserLogged } from "@/services/auth.service";
import { BookingData } from "@/utils/interfaces/booking.interface";
import { Calendar } from "../calendar/calendar.component";
import dayjs from "dayjs";
import { useRoute } from "@react-navigation/native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
} from "@/components/ui/actionsheet";
import { SearchIcon } from "@/components/ui/icon";
import { useGetCoordinatesFromAddress } from "@/hooks/get-direction.hook";
import { useAuth } from "@/context/auth.context";
import { string } from "yup";

type Step1BookingProps = {
  formattedTime: string;
  formattedDate: string;
  showActionSheet: boolean;
  setShowActionSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setStepper: React.Dispatch<React.SetStateAction<number>>;
  updateBookingData: any;
  data: BookingData;
};

export const Step1Booking = (props: Step1BookingProps) => {
  const {
    formattedDate,
    formattedTime,
    setShowActionSheet,
    setStepper,
    data: dataFormulary,
    showActionSheet,
    updateBookingData,
  } = props;
  const params = useRoute().params as {
    type: string;
  };

  const { t } = useTranslation();

  const { data } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
    refreshInterval: 5,
  });

  const { locations, setSelectedLocation, geocodeAddress } =
    useGetCoordinatesFromAddress();

  const [addressName, setAddressName] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [type, setType] = useState<"date" | "time">("date");
  const [showCalendar, setShowCalendar] = useState(false);

  const openDatePicker = () => {
    setShowCalendar(true);
    setType("date");
  };

  const openTimePicker = () => {
    setShowCalendar(true);
    setType("time");
  };

  const handleDateChange = (selectedDate: Date) => {
    if (type === "date") {
      setDate(selectedDate);
    } else if (type === "time") {
      setTime(selectedDate);
    }

    updateBookingData((prev: BookingData) => ({
      ...prev,
      programedTo: dayjs(selectedDate).format("YYYY-MM-DD HH:mm:ss"),
    }));
  };

  const formattedDatePickup = date ? dayjs(date).format("DD/MM/YYYY") : "";
  const formattedTimePickup = time ? dayjs(time).format("HH:mm") : "";

  useEffect(() => {
    if (dataFormulary?.programedTo) {
      const parsedDate = dayjs(dataFormulary.programedTo).toDate();
      setDate(parsedDate);
      setTime(parsedDate);
    }
  }, [dataFormulary?.programedTo]);

  const [showAddressActionsheet, setShowAddressActionsheet] = useState(false);
  const [typeOfAddress, setTypeOfAddress] = useState<"current" | "destinity">(
    "current"
  );
  const [addressLocation, setAddressLocation] = useState<{
    latitude: string;
    longitude: string;
  }>({
    latitude: "",
    longitude: "",
  });
  const [destinityLocation, setDestinityLocation] = useState<{
    latitude: string;
    longitude: string;
  }>({
    latitude: "",
    longitude: "",
  });
  const [destinityAddress, setDestinityAddress] = useState("");
  const handleSearch = (searchText: string) => {
    if (searchText.trim()) {
      geocodeAddress(searchText);
    }
  };

  const handleNextStep = () => {
    updateBookingData((prev: BookingData) => ({
      ...prev,
      currentLocation: {
        latitude:
          addressName.length > 1
            ? addressLocation.latitude
            : data?.userInfo.hotel_location?.lat,
        longitude:
          addressName.length > 1
            ? addressLocation.longitude
            : data?.userInfo.hotel_location?.lng,
        address: addressName ? addressName : data?.userInfo.hotel_name,
      },
      destination: {
        latitude:
          destinityAddress.length > 1
            ? destinityLocation.latitude
            : dataFormulary?.destination.latitude,
        longitude:
          destinityAddress.length > 1
            ? destinityLocation.longitude
            : dataFormulary?.destination.longitude,
        address: destinityLocation
          ? destinityAddress
          : dataFormulary?.destination.address,
      },
    }));

    setStepper(2);
  };

  const isDestinationValid = Boolean(
    dataFormulary.destination?.address?.length || destinityAddress.length > 1
  );

  const dates = Boolean(
    date ||
      (formattedDate && params.type !== "PICKUP" && params.type !== "DROPOFF")
  );

  const times = Boolean(
    time ||
      (formattedTime && params.type !== "PICKUP" && params.type !== "DROPOFF")
  );

  return (
    <>
      <Pressable
        style={{
          backgroundColor: Colors.WHITE,
          paddingHorizontal: 16,
        }}
        onPress={() => Keyboard.dismiss()}
      >
        <Text fontSize={24} fontWeight={400}>
          {t("home.map_home.first_sheet.title", { ns: "home" })}
        </Text>

        {!Boolean(params.type?.length) && (
          <HStack space="md" className="mt-6">
            <Badge style={styles.badge} className="rounded-full gap-1">
              <BadgeIcon as={CalendarActive} />
              <Text
                fontSize={12}
                fontWeight={400}
                textColor={Colors.DARK_GREEN}
              >
                {formattedDate}
              </Text>
            </Badge>
            <Badge style={styles.badge} className="rounded-full gap-1">
              <ClockActive height={16} width={16} />

              <Text
                fontSize={12}
                fontWeight={400}
                textColor={Colors.DARK_GREEN}
              >
                {formattedTime}
              </Text>
            </Badge>
          </HStack>
        )}
        <VStack space="md" className="mt-6">
          {Boolean(params.type?.length) && (
            <HStack style={styles.hour} className="gap-2">
              <Input
                label=""
                onBlur={() => {}}
                onChangeText={() => {}}
                placeholder="DD/MM/AAAA"
                leftIcon
                icon={CalendarActive}
                stretch
                onPress={openDatePicker}
                editable={false}
                pressable
                value={formattedDatePickup}
              />
              <Input
                label=""
                onBlur={() => {}}
                onChangeText={() => {}}
                placeholder="HH : MM"
                leftIcon
                icon={ClockActive}
                stretch
                onPress={openTimePicker}
                editable={false}
                pressable
                value={formattedTimePickup}
              />
            </HStack>
          )}
          <Input
            label=""
            onBlur={() => {}}
            onChangeText={() => {}}
            placeholder={t("home.map_home.first_sheet.fields.starting_point", {
              ns: "home",
            })}
            leftIcon
            icon={Send}
            value={
              addressName ? addressName : dataFormulary.currentLocation.address
            }
            editable={false}
            pressable={true}
            onPress={() => {
              setShowAddressActionsheet(true);
              setTypeOfAddress("current");
            }}
          />
          <Input
            label=""
            onBlur={() => {}}
            onChangeText={() => {}}
            placeholder={t("home.map_home.first_sheet.fields.destination", {
              ns: "home",
            })}
            leftIcon
            icon={LocationFilled}
            value={
              destinityAddress
                ? destinityAddress
                : dataFormulary?.destination.address
            }
            editable={false}
            pressable={true}
            onPress={() => {
              setShowAddressActionsheet(true);
              setTypeOfAddress("destinity");
            }}
          />
        </VStack>
        <View className="mt-6">
          <Text fontSize={16} fontWeight={400} textColor={Colors.DARK_GREEN}>
            {t("home.map_home.first_sheet.usual_destinations", {
              ns: "home",
            })}
          </Text>
          {[0, 1, 2].map((_, i) => (
            <React.Fragment key={i}>
              <HStack space="md" className="mt-4">
                <ClockActive width={20} height={20} />
                <Box className="gap-2">
                  <Text fontSize={16} fontWeight={400}>
                    Aeropuerto internacional
                  </Text>
                  <Text fontSize={14} fontWeight={400} textColor={Colors.GRAY}>
                    Calle 123, 3456 - Santiago
                  </Text>
                </Box>
              </HStack>
              <Divider className="mt-2" style={styles.divider} />
            </React.Fragment>
          ))}
        </View>
        <Pressable
          className="flex-row gap-2 items-center mt-6 mb-6"
          onPress={() => setShowActionSheet(true)}
        >
          <View style={styles.location_container}>
            <LocationFilled />
          </View>
          <Text fontSize={16} fontWeight={400}>
            {t("home.map_home.first_sheet.mark_map", { ns: "home" })}
          </Text>
        </Pressable>
        {isDestinationValid && times && dates && (
          <Button onPress={() => handleNextStep()} stretch>
            {t("home.next", { ns: "home" })}
          </Button>
        )}
      </Pressable>
      {showCalendar && (
        <Calendar
          type={type}
          isVisible={true}
          onClose={() => setShowCalendar(false)}
          onDateChange={handleDateChange}
          date={type === "date" ? date || new Date() : time || new Date()}
          minimumDate={new Date()}
        />
      )}
      <Actionsheet
        isOpen={showAddressActionsheet}
        onClose={() => setShowAddressActionsheet(false)}
        snapPoints={[70]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="pb-10">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <View style={styles.search_bar_container}>
            <Input
              placeholder={t("map_sheet", { ns: "utils" })}
              label=""
              onBlur={() => {}}
              onChangeText={handleSearch}
              className=""
              icon={SearchIcon}
              rightIcon
              size="sm"
            />
          </View>
          <ActionsheetFlatList
            data={locations}
            renderItem={({ item }: any) => (
              <>
                <Pressable
                  onPress={() => {
                    setSelectedLocation(item);
                    if (typeOfAddress === "current") {
                      setAddressLocation(item);
                      setAddressName(
                        `${item.name.split(",")[0]},${item.name.split(",")[1]}.`
                      );
                    } else {
                      setDestinityLocation(item);
                      setDestinityAddress(
                        `${item.name.split(",")[0]},${item.name.split(",")[1]}.`
                      );
                    }

                    setShowAddressActionsheet(false);
                  }}
                  className="py-2.5 px-4 border-b border-[#9FE4DD] bg-white rounded-lg mb-2.5"
                >
                  <Box className="gap-4">
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      {item.name}
                    </Text>
                  </Box>
                </Pressable>
              </>
            )}
            contentContainerClassName="gap-4"
            keyExtractor={(item: any) => item.id.toString()}
          />
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.PRIMARY,
  },
  divider: {
    backgroundColor: Colors.PRIMARY,
  },
  location_container: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: Colors.LIGHT_GRADIENT_1,
    justifyContent: "center",
    alignItems: "center",
  },
  hour: {
    marginTop: 12,
  },
  search_bar_container: {
    width: "100%",
    marginBottom: 24,
    marginTop: 24,
  },
});
