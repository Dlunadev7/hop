import { Notification } from "@/assets/svg";
import {
  Balance,
  TakeABooking,
  Container,
  Header,
  Services,
  Booking,
  Void,
  BookingsHopper,
  ModalBooking,
} from "@/components";
import { ChevronDownIcon, ChevronUpIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { keysToCheck } from "@/constants/check-validations";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/auth.context";
import capitalizeWords from "@/helpers/capitalize-words";
import { useSocket } from "@/hooks/use-socket.hook";
import { checkEmptyFields } from "@/helpers/check-empty-fields";
import { getUserLogged } from "@/services/auth.service";
import { userRoles } from "@/utils/enum/role.enum";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import useSWR from "swr";
import { TravelNotification } from "@/utils/interfaces/booking.notification.interface";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";

export default function HomeScreen() {
  const navigator = useNavigation();
  const { t } = useTranslation();
  const { token, location } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [travelData, setTravelData] = useState<TravelNotification>();
  const { data, error } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
  });

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          title={`${t("home.header", { ns: "home" })} ${capitalizeWords(
            data?.userInfo.firstName || ""
          )}!`}
          icon={<Notification />}
          onPressIcon={() => router.push("/notification")}
        />
      ),
    });
  }, [navigator, data]);

  console.log(token, data?.id);

  const emptyFields = checkEmptyFields(
    data?.userInfo!,
    keysToCheck.filter((item) =>
      data?.role === userRoles.USER_HOPPER
        ? item !== "hotel_name" && item !== "hotel_location"
        : true
    )
  );
  const height = useState(new Animated.Value(400))[0];
  const toggleContainer = () => {
    setIsOpen(!isOpen);

    Animated.timing(height, {
      toValue: isOpen ? 60 : 400,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const socket = useSocket("https://hop.api.novexisconsulting.xyz");

  useEffect(() => {
    if (!socket || !data?.id) return;

    const eventName = `user-${data.id}`;

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("Conectado al socket");
    });

    socket.on(eventName, (message: TravelNotification) => {
      setIsModalOpen(true);
      setTravelData(message);
    });

    return () => {
      socket.off(eventName);
    };
  }, [socket, data?.id]);

  const renderContent =
    data?.role === userRoles.USER_HOPPY ? (
      <Container extraHeight={true} style={{ borderBottomStartRadius: 20 }}>
        <Balance />
        <TakeABooking />
        <Services />
        <Booking />
      </Container>
    ) : (
      <Animated.View style={[styles.animated_container, { height: height }]}>
        <Container extraHeight={false} style={{ borderBottomStartRadius: 20 }}>
          <VStack className="mt-4">
            <Balance />
            <View style={{}}>
              {emptyFields.length > 0 && <Void />}
              {emptyFields.length === 0 && <BookingsHopper />}
            </View>
          </VStack>
        </Container>
        <Pressable onPress={toggleContainer} style={styles.arrow}>
          {isOpen ? <Icon as={ChevronUpIcon} /> : <Icon as={ChevronDownIcon} />}
        </Pressable>
      </Animated.View>
    );

  const handleClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (data && !data?.isActive) {
      router.replace(AuthRoutesLink.WAITING_VALIDATION);
    }
  }, [data?.isActive]);

  console.log(data);

  return (
    <View className="flex-1">
      {renderContent}
      {data?.role === userRoles.USER_HOPPER && (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            latitude: location?.latitude || 0,
            longitude: location?.longitude || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location?.latitude || 0,
              longitude: location?.longitude || 0,
            }}
          />
        </MapView>
      )}
      {isModalOpen && data!.role === userRoles.USER_HOPPER && (
        <ModalBooking
          isOpen={isModalOpen}
          handleClose={handleClose}
          travel={travelData!}
          user={data!}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  arrow: {
    position: "absolute",
    bottom: -20,
    right: 0,
    backgroundColor: Colors.WHITE,
    padding: 5,
    alignItems: "center",
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
    width: 80,
  },
  animated_container: {
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  map: {
    flex: 1,
    width: "100%",
  },
});
