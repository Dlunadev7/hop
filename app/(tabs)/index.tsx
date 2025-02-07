import { AvatarHopper, Calendar, Notification, Warning } from "@/assets/svg";
import {
  Balance,
  TakeABooking,
  Container,
  Header,
  Services,
  Booking,
  Void,
  BookingsHopper,
  LinearGradient,
} from "@/components";
import Advice from "@/components/hopper/advice.component";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { Text } from "@/components/text/text.component";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon, ChevronUpIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { keysToCheck } from "@/constants/check-validations";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/auth.context";
import capitalizeWords from "@/helpers/capitalize-words";
import usePushNotifications from "@/hooks/use-push-notifications.hook";
import { useSocket } from "@/hooks/use-socket.hook";
import { updateUserData } from "@/services/user.service";
import { checkEmptyFields } from "@/helpers/check-empty-fields";
import { getUserLogged } from "@/services/auth.service";
import { userRoles } from "@/utils/enum/role.enum";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import useSWR from "swr";

export default function HomeScreen() {
  const navigator = useNavigation();
  const { t } = useTranslation();
  const { token, location } = useAuth();
  const { data, error } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
  });

  const pushNotifications = usePushNotifications();

  useEffect(() => {
    if (pushNotifications) {
      (async () =>
        await updateUserData(data?.id!, {
          email: data?.email,
          userNotificationToken: pushNotifications,
        }))();
    }
  }, []);

  const socket = useSocket("https://hop.api.novexisconsulting.xyz");

  useEffect(() => {
    if (!socket || !data?.id) return;

    const eventName = `user-${data.id}`;

    console.log("Esperando conexión al socket...");

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => console.log("conectado"));

    socket.on("message", (message: any) => {
      console.log("Mensaje recibido:", message);
    });

    return () => {
      socket.off(eventName);
    };
  }, [socket, data?.id]);

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

  const userInfo = data?.userInfo;

  const emptyFields = checkEmptyFields(userInfo!, keysToCheck);
  const [isOpen, setIsOpen] = useState(true);
  const height = useState(new Animated.Value(350))[0];
  const toggleContainer = () => {
    setIsOpen(!isOpen);

    Animated.timing(height, {
      toValue: isOpen ? 60 : 400,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const bookings = [1, 2, 3, 4];

  const renderContent =
    data?.role === userRoles.USER_HOPPY ? (
      <>
        <TakeABooking />
        <Services />
        <Booking />
      </>
    ) : (
      <View style={{}}>
        {emptyFields.length > 0 && <Void />}
        <BookingsHopper bookings={bookings} />
        {bookings.length === 0 && <Advice />}
      </View>
    );

  return (
    <>
      <Animated.View style={[styles.animated_container, { height: height }]}>
        <Container extraHeight={false} style={{ borderBottomStartRadius: 20 }}>
          <VStack className="mt-4">
            <Balance />
            {renderContent}
          </VStack>
        </Container>
        <Pressable onPress={toggleContainer} style={styles.arrow}>
          {isOpen ? <Icon as={ChevronUpIcon} /> : <Icon as={ChevronDownIcon} />}
        </Pressable>
      </Animated.View>
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
    </>
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
