import {
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { StatusBar } from "expo-status-bar";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ArrowLeftRounded, LocationFilled } from "@/assets/svg";
import MapView, { Marker } from "react-native-maps";
import {
  useGetAddressFromCoordinates,
  useGetCoordinatesFromAddress,
  useGetRouteTime,
} from "@/hooks/get-direction.hook";
import { useAuth } from "@/context/auth.context";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { AssetsImages } from "@/assets/images";
import { BottomSheet } from "@/components/sheet/sheet.component";
import { Text } from "@/components/text/text.component";
import { VStack } from "@/components/ui/vstack";
import {
  Input,
  Step2Booking,
  Step2BookingPickup,
  Step3Booking,
  Step4Booking,
  Step5Booking,
} from "@/components";
import { Button } from "@/components/button/button.component";
import { Step1Booking } from "@/components";
import { router } from "expo-router";
import { travelTypeValues } from "@/utils/enum/travel.enum";
import useSWR from "swr";
import { getUserLogged } from "@/services/auth.service";

export default function MapHome() {
  const params = useRoute().params as { type: string };
  const route = useRoute().params as { time: string; date: string };
  const { address, getAddress, selectedLocation } =
    useGetAddressFromCoordinates();
  const { location } = useAuth();
  const { t } = useTranslation();
  const { data } = useSWR("/user/logged", getUserLogged);

  const [stepper, setStepper] = useState(1);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const formattedDate = dayjs(route.date).format("DD MMM. YYYY");
  const formattedTime = dayjs(route.time).format("HH:mm");
  const origin: [number, number] = [location?.longitude!, location?.latitude!];
  const destination: [number, number] = [
    selectedLocation?.longitude!,
    selectedLocation?.latitude!,
  ];

  const { route: routeTime, loading } = useGetRouteTime(origin, destination);

  const type = params.type ? params.type : travelTypeValues.PROGRAMED;

  const AIRPORT_CHILE = {
    name: "Aeropuerto",
    latitude: -33.392777777778,
    longitude: -70.785555555556,
  };

  const [bookingData, setBookingData] = useState({
    type: type,
    destination: {
      latitude: selectedLocation?.latitude || null,
      longitude: selectedLocation?.longitude || null,
      address: address || "",
    },
    currentLocation: {
      latitude: location?.latitude || null,
      longitude: location?.longitude || null,
      address: data?.userInfo.hotel_name,
    },
    fullName: "",
    contact: "",
    roomNumber: "",
    numberOfPassengers: 1,
    numberOfLuggages: 0,
    vehicleType: "",
    reducedMobility: false,
    programedTo: "",
    flightNumber: "",
    airline: "",
    carType: "",
    time: routeTime?.duration,
    distance: routeTime?.distance,
    price: 0,
    hoppyCommission: 0,
    countryCode: "",
  });

  useEffect(() => {
    if (type === travelTypeValues.PICKUP) {
      setBookingData((prevData) => ({
        ...prevData,
        currentLocation: {
          latitude: AIRPORT_CHILE.latitude,
          longitude: AIRPORT_CHILE.longitude,
          address: AIRPORT_CHILE.name,
        },
        destination: {
          latitude: location?.latitude || null,
          longitude: location?.longitude || null,
          address: data?.userInfo.hotel_name || "",
        },
      }));
    } else if (type === travelTypeValues.DROPOFF) {
      setBookingData((prevData) => ({
        ...prevData,
        currentLocation: {
          latitude: location?.latitude || null,
          longitude: location?.longitude || null,
          address: data?.userInfo.hotel_name,
        },
        destination: {
          latitude: AIRPORT_CHILE.latitude,
          longitude: AIRPORT_CHILE.longitude,
          address: AIRPORT_CHILE.name,
        },
      }));
    } else if (type === travelTypeValues.PROGRAMED) {
      setBookingData((prevData) => ({
        ...prevData,
        currentLocation: {
          latitude: location?.latitude || null,
          longitude: location?.longitude || null,
          address: data?.userInfo.hotel_name,
        },
      }));
    }
  }, [type, selectedLocation, data?.userInfo.hotel_name]);

  useEffect(() => {
    if (routeTime) {
      setBookingData((prev) => ({
        ...prev,
        time: routeTime?.duration,
        distance: routeTime?.distance,
      }));
    }
  }, [routeTime]);

  const mapRegion = useCallback(() => {
    if (!location) return undefined;
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }, [location]);

  const onPressMap = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    getAddress(latitude, longitude);
  };

  const handlePressBack = () => {
    if (openBottomSheet) {
      setOpenBottomSheet(false);
      return;
    }

    if (stepper === 1) {
      router.back();
    } else {
      setStepper(stepper - 1);
    }
  };

  const steps: Record<number, React.ReactElement | React.ReactElement[]> = {
    1: (
      <Step1Booking
        formattedDate={formattedDate}
        formattedTime={formattedTime}
        showActionSheet={openBottomSheet}
        setShowActionSheet={setOpenBottomSheet}
        updateBookingData={setBookingData}
        setStepper={setStepper}
        data={bookingData}
      />
    ),
    2:
      params.type === travelTypeValues.PICKUP ? (
        <Step2BookingPickup
          setStepper={setStepper}
          updateBookingData={setBookingData}
          data={bookingData}
        />
      ) : (
        <Step2Booking
          setStepper={setStepper}
          updateBookingData={setBookingData}
          data={bookingData}
        />
      ),
    3: (
      <Step3Booking
        setStepper={setStepper}
        updateBookingData={setBookingData}
        data={bookingData}
        date={route.time}
      />
    ),
    4: (
      <Step4Booking
        formattedDate={formattedDate}
        formattedTime={formattedTime}
        setStepper={setStepper}
        data={bookingData}
        date={route.time}
      />
    ),
    5: (
      <Step5Booking
        formattedDate={formattedDate}
        formattedTime={formattedTime}
        data={bookingData}
        date={route.time}
      />
    ),
  };

  return (
    <View className="flex-1">
      <StatusBar hidden />
      {!(stepper > 3) && (
        <Fab
          placement="top left"
          onPress={() => handlePressBack()}
          style={styles.fab}
          className="bg-[#E1F5F3] w-[50px] h-[50px]"
        >
          <FabIcon as={ArrowLeftRounded} width={30} />
        </Fab>
      )}
      <View className="flex-1">
        <>
          <MapView
            style={styles.map}
            showsUserLocation={true}
            initialRegion={mapRegion()}
            onPress={onPressMap}
            onMapLoaded={() => console.log("Mapa cargado")}
          >
            {selectedLocation && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                }}
              >
                <View className="w-[30px] h-[30px]">
                  <Image
                    source={AssetsImages.marker_icon}
                    className="w-full h-full"
                  />
                </View>
              </Marker>
            )}
          </MapView>
          {!openBottomSheet ? (
            <BottomSheet
              content={steps[stepper] || <></>}
              isOpen={true}
              setIsOpen={() => {}}
              snapPoints={["85%", "85%", "85%"]}
            />
          ) : (
            <View style={styles.actionSheet}>
              <Text fontSize={24} fontWeight={400} className="mb-6">
                {t("signup.step_1.mark_map", { ns: "auth" })}
              </Text>
              <VStack className="gap-5">
                <Input
                  label=""
                  value={address ?? ""}
                  editable={false}
                  placeholder={t("signup.step_1.select_map", {
                    ns: "auth",
                  })}
                  onChangeText={() => {}}
                  onBlur={() => {}}
                  icon={LocationFilled}
                  leftIcon
                />

                <Button
                  onPress={() => {
                    setBookingData((prevState) => ({
                      ...prevState,
                      destination: {
                        ...prevState?.destination,
                        latitude: selectedLocation?.latitude || null,
                        longitude: selectedLocation?.longitude || null,
                        address: address || "",
                      },
                    }));
                    setOpenBottomSheet(false);
                  }}
                >
                  {t("signup.step_1.confirm_address", { ns: "auth" })}
                </Button>
              </VStack>
            </View>
          )}
        </>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    position: "absolute",
    bottom: 100,
    left: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  actionSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingVertical: 28,
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
  },
  fab: {
    marginTop: 32,
  },
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
  mark_map: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingVertical: 28,
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    height: 244,
  },
});
