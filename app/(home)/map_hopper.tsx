import {
  ArrowDegRight,
  ArrowLeftRounded,
  Booking,
  Calendar,
  Clock,
  DolarCircle,
  InfoCircle,
  LocationFilled,
  Routing,
  Send,
} from "@/assets/svg";
import { ModalBooking } from "@/components";
import { Text } from "@/components/text/text.component";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Fab, FabIcon } from "@/components/ui/fab";
import { HStack } from "@/components/ui/hstack";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { formattedDate } from "@/helpers/parse-date";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button as CustomButton } from "@/components/button/button.component";
import { HomeRoutesLink } from "@/utils/enum/home.routes";
import { useRoute } from "@react-navigation/native";
import { TravelNotification } from "@/utils/interfaces/booking.notification.interface";
import { getTravelById, updateTravel } from "@/services/book.service";
import { BookingResponse } from "@/utils/interfaces/booking.interface";
import { status } from "@/helpers/parser-names";
import { paymentColor } from "@/helpers/payment-status";
import { travelStatus } from "@/utils/enum/travel.enum";
import { getFormattedTime } from "@/helpers/add-time";

const { width } = Dimensions.get("window");

export default function MapHopper() {
  const { travel } = useRoute().params as { travel: string };
  const insets = useSafeAreaInsets();
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const containerWidth = width - 32;
  const travelParsed: BookingResponse = JSON.parse(travel);
  const { date, time } = formattedDate(travelParsed.programedTo);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isInfoOpen]);

  const handleClose = () => {
    setIsInfoOpen(true);
  };

  const estimatedTime = getFormattedTime(travelParsed.time);

  useFocusEffect(
    useCallback(() => {
      setIsInfoOpen(true);
    }, [])
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
      </MapView>
      {!showRoute && (
        <Fab
          placement="top left"
          onPress={() => router.back()}
          className="bg-[#E1F5F3] w-[50px] h-[50px]"
          style={{ marginTop: insets.top }}
        >
          <FabIcon as={ArrowLeftRounded} width={30} />
        </Fab>
      )}
      <Modal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        style={{ paddingHorizontal: 16, position: "absolute", top: -100 }}
      >
        <ModalContent className="rounded-[20px] bg-[#E1F5F3] w-[100%]">
          <ModalHeader className="flex-col">
            <Box className="flex-row items-center gap-2 justify-center w-full">
              <Booking width={28} height={28} />
              <Text fontSize={20} fontWeight={600}>
                {status[travelParsed.type!]}
              </Text>
            </Box>
            <Box className="flex-row gap-2">
              <Badge
                className="gap-2 rounded-full items-center justify-center px-2"
                style={styles.badge}
              >
                <Calendar width={16} height={16} color={Colors.DARK_GREEN} />
                <Text
                  fontSize={14}
                  fontWeight={600}
                  textColor={Colors.DARK_GREEN}
                >
                  {date}
                </Text>
              </Badge>
              <Badge
                className="gap-2 rounded-full items-center justify-center px-2"
                style={styles.badge}
              >
                <Clock width={16} height={16} color={Colors.DARK_GREEN} />
                <Text
                  fontSize={14}
                  fontWeight={600}
                  textColor={Colors.DARK_GREEN}
                >
                  {time}
                </Text>
              </Badge>
            </Box>
          </ModalHeader>
          <ModalBody>
            <Box
              style={{ backgroundColor: Colors.WHITE }}
              className="mt-3 p-2 gap-2 rounded-[14px]"
            >
              <VStack space="sm">
                <Text textColor={Colors.GRAY} fontWeight={300} fontSize={12}>
                  Punto de partida
                </Text>
                <Box className="flex-row gap-2 items-center">
                  <Send />
                  <Text fontSize={16} fontWeight={400}>
                    {travelParsed.from.address}
                  </Text>
                </Box>
              </VStack>
              <Divider className="mt-2" style={styles.divider} />
              <VStack space="sm">
                <Text textColor={Colors.GRAY} fontWeight={300} fontSize={12}>
                  Destino
                </Text>
                <Box className="flex-row gap-2 items-center">
                  <LocationFilled />
                  <Text fontSize={16} fontWeight={400}>
                    {travelParsed.to.address}
                  </Text>
                </Box>
              </VStack>
            </Box>
            <HStack className="mt-4 items-center justify-between">
              <Text fontSize={14} fontWeight={400}>
                Distancia:{" "}
                <Text fontSize={16} fontWeight={600}>
                  {travelParsed.distance.toFixed(2)}km
                </Text>
              </Text>
              <Badge
                className="rounded-full gap-1"
                style={{
                  backgroundColor: paymentColor[travelParsed.paymentStatus],
                }}
              >
                <DolarCircle />
                <Text
                  fontSize={18}
                  fontWeight={600}
                  textColor={Colors.DARK_GREEN}
                >
                  ${travelParsed.price?.toFixed(2)}
                </Text>
              </Badge>
            </HStack>
          </ModalBody>
          <ModalFooter className="flex-col">
            <Button
              variant="outline"
              style={styles.more_info}
              onPress={() => {
                router.navigate({
                  pathname: "/(booking)/[id]",
                  params: {
                    id: travelParsed.id,
                  },
                });
                setIsInfoOpen(false);
              }}
            >
              <Text textColor={Colors.SECONDARY} fontWeight={600} fontSize={16}>
                Mas info
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isInfoOpen && (
        <Box
          style={{ position: "absolute", bottom: 40 }}
          className="justify-center items-center w-full"
        >
          <CustomButton
            onPress={() => {
              setShowRoute(true);
              setIsInfoOpen(false);
              updateTravel(travelParsed.id!, {
                status: travelStatus.START,
              } as BookingResponse);
            }}
          >
            Iniciar Viaje
          </CustomButton>
        </Box>
      )}

      {showRoute && (
        <View
          style={[styles.actionSheet, { paddingBottom: insets.bottom + 12 }]}
        >
          <HStack className="justify-between">
            <Text
              fontSize={24}
              fontWeight={600}
              className="mb-6"
              textColor={Colors.DARK_GREEN}
            >
              {travelParsed.time.toFixed(2)} min
            </Text>
            <Box className="gap-2 flex-row">
              <View
                className="rounded-full bg-slate-700 items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: Colors.PRIMARY,
                }}
              >
                <Routing />
              </View>
              <View
                className="rounded-full bg-slate-700 items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: Colors.PRIMARY,
                }}
              >
                <InfoCircle />
              </View>
            </Box>
          </HStack>
          <VStack className="gap-5">
            <Text fontSize={16} fontWeight={400} textColor={Colors.GRAY}>
              {travelParsed.distance.toFixed(2)} km -{estimatedTime}
            </Text>
            <CustomButton
              onPress={() => {
                updateTravel(travelParsed.id, {
                  status: travelStatus.END,
                } as BookingResponse);

                router.replace({
                  pathname: HomeRoutesLink.CONFIRMATION,
                  params: {
                    commission: travelParsed.hopperCommission,
                    title: "Viaje finalizado con exito",
                    subtitle: "¡Ganaste comisión por este viaje!",
                  },
                });
              }}
              stretch
              disabled={isButtonDisabled}
              type={isButtonDisabled ? "ghost" : ""}
            >
              Finalizar viaje
            </CustomButton>
          </VStack>
        </View>
      )}
      {showRoute && (
        <Box style={[styles.card_gps, { width: containerWidth }]}>
          <HStack className="gap-4 items-center">
            <ArrowDegRight />
            <Box className="flex-col gap-2">
              <Text fontSize={28} fontWeight={600} textColor={Colors.WHITE}>
                Calle las palmas
              </Text>
              <Text fontSize={20} fontWeight={400} textColor={Colors.WHITE}>
                Hacia calle copernico
              </Text>
            </Box>
          </HStack>
          <Text fontSize={20} fontWeight={400} textColor={Colors.WHITE}>
            1,5 Km
          </Text>
        </Box>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  badge: {
    alignSelf: "flex-end",
    alignItems: "center",
    paddingHorizontal: 2,
    paddingVertical: 4,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 40,
    marginTop: 12,
  },
  divider: {
    backgroundColor: Colors.PRIMARY,
  },
  more_info: {
    borderColor: Colors.SECONDARY,
    minWidth: 230,
    borderRadius: 12,
    height: 44,
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
  card_gps: {
    position: "absolute",
    top: 40,
    backgroundColor: Colors.DARK_GREEN,
    height: 141,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
  },
});
