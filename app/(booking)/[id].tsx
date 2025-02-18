import useSWR from "swr";
import dayjs from "dayjs";
import React, { ReactElement, useEffect, useState } from "react";
import { Text } from "@/components/text/text.component";
import { router, useNavigation } from "expo-router";
import { Container, Header, Input } from "@/components";
import { useRoute } from "@react-navigation/native";
import { getTravelById, updateTravel } from "@/services/book.service";
import { travelStatus, travelTypeValues } from "@/utils/enum/travel.enum";
import { Badge } from "@/components/ui/badge";
import {
  AirplaneArrival,
  AirplaneOutlined,
  Calendar,
  Car,
  Clock,
  ClockCustom,
  DolarCircle,
  DropOff,
  ElectricCar,
  LocationFilled,
  Luggage,
  Messages,
  People,
  PeopleColored,
  Profile,
  ProfileActive,
  Reserve,
  Routing,
  Sedan,
  Send,
  ShippingBagColored,
  ShoppingBag,
  Ticket,
  UserSquare,
  UserSquareOutlined,
  Van,
  Warning,
  WarningHexa,
  WarningToast,
} from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/button/button.component";
import BookingEditForm from "@/components/forms/booking/booking-edit.form";
import { useTranslation } from "react-i18next";
import { getUserById, getUserLogged } from "@/services/auth.service";
import { userRoles } from "@/utils/enum/role.enum";
import { formattedDate } from "@/helpers/parse-date";
import {
  payment,
  paymentColor,
  paymentIcon,
  paymentTextColor,
} from "@/helpers/payment-status";
import { paymentStatus } from "@/utils/enum/payment.enum";
import { HomeRoutesLink } from "@/utils/enum/home.routes";
import { Center } from "@/components/ui/center";

export default function Booking() {
  const navigator = useNavigation();
  const { t } = useTranslation();
  const { id } = useRoute().params as { id: string };
  const { data: user } = useSWR("/user/logged", getUserLogged);
  const { data } = useSWR("/travel/one", () => getTravelById(id), {
    revalidateOnMount: true,
  });
  const { data: userHoppy } = useSWR(
    data?.hoppy?.id ? `/user/${data.hoppy.id}` : null,
    () => getUserById(data?.hoppy.id!),
    { revalidateOnMount: true }
  );

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const handleHover = (id: number, isHovered: boolean) => {
    setHoveredIndex(isHovered ? id : null);
  };

  const status: Record<travelTypeValues, string> = {
    PICKUP: "Pick Up",
    DROPOFF: "Drop Off",
    PROGRAMED: "Programmed",
    INSTANT: "",
  };

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          title={status[data?.type as travelTypeValues]}
          arrow
          onPressArrow={() => router.back()}
          edit={
            user?.role === userRoles.USER_HOPPY &&
            !isEditable &&
            data?.type !== travelTypeValues.PROGRAMED
          }
          onPressEdit={() => setIsEditable(true)}
        />
      ),
    });
  }, [navigator, data, isEditable]);

  const { date, time } = formattedDate(new Date());

  const shortcuts = [
    {
      icon: Routing,
      name: `${data?.from?.address} - ${data?.to?.address}`,
    },
    {
      icon: UserSquareOutlined,
      name: data?.hopper?.userInfo?.firstName || "",
    },
    {
      icon: Messages,
      name: `${data?.passengerContactCountryCode} ${data?.passengerContact}`,
    },
    {
      icon: AirplaneOutlined,
      name: data?.passengerFligth,
    },
    {
      icon: Car,
      name: "Hopper name",
    },
    {
      icon: Ticket,
      name: `Valor del viaje: $${"0"}`,
    },
  ];

  const shortcutsHopper = [
    {
      icon: UserSquareOutlined,
      name: data?.hopper?.userInfo?.firstName || "",
    },
    {
      icon: Messages,
      name:
        `${data?.passengerContactCountryCode} ${data?.passengerContact}` || "",
    },
    {
      icon: AirplaneOutlined,
      name: data?.passengerFligth || "",
    },
    {
      icon: ShippingBagColored,
      name: `${data?.totalSuitCases} ${
        Number(data?.totalSuitCases) > 1
          ? t("booking.card.luggages", { ns: "booking" })
          : t("booking.card.luggage", { ns: "booking" })
      }`,
    },
    {
      icon: PeopleColored,
      name:
        `${data?.totalPassengers} ${
          Number(data?.totalPassengers) > 1
            ? t("booking.card.passengers", { ns: "booking" })
            : t("booking.card.passenger", { ns: "booking" })
        }` || "",
    },
    {
      icon: Reserve,
      name:
        `${userHoppy?.userInfo?.firstName} ${userHoppy?.userInfo?.lastName}` ||
        "",
    },
    {
      icon: Ticket,
      name: `Valor del viaje: $${"0"}` || "",
    },
  ];

  const filteredShortcuts = shortcuts.filter((item) => {
    if (data?.type !== travelTypeValues.PICKUP) {
      if (item.icon === AirplaneArrival || item.icon === AirplaneOutlined) {
        return false;
      }
    }
    return true;
  });

  const vehicleName: { [key: string]: string } = {
    SEDAN: "Sedan",
    VANS: "Van",
    ELECTRIC: "Electric Car",
  };

  const Icon = paymentIcon[data?.paymentStatus!];

  if (!data) {
    return (
      <Center>
        <ActivityIndicator color={Colors.PRIMARY} />
      </Center>
    );
  }

  return (
    <Container>
      {!isEditable ? (
        <>
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
          {user?.role !== userRoles.USER_HOPPER && (
            <HStack space="md" className="mt-8 items-start">
              <Box className="gap-2 justify-between">
                <Text fontSize={20} fontWeight={600}>
                  {vehicleName[data?.vehicleType!]}
                </Text>
                <VStack className="mt-2 gap-2">
                  <Box className="flex-row">
                    <ProfileActive width={16} height={16} />
                    <Text
                      fontSize={14}
                      fontWeight={400}
                      textColor={Colors.GRAY}
                    >
                      {data?.totalPassengers}{" "}
                      {Number(data?.totalPassengers) > 1
                        ? t("booking.card.passengers", { ns: "booking" })
                        : t("booking.card.passenger", { ns: "booking" })}
                    </Text>
                  </Box>
                  <Box className="flex-row">
                    <Luggage />
                    <Text
                      fontSize={14}
                      fontWeight={400}
                      textColor={Colors.GRAY}
                    >
                      {data?.totalSuitCases}{" "}
                      {Number(data?.totalSuitCases) > 1
                        ? t("booking.card.luggages", { ns: "booking" })
                        : t("booking.card.luggage", { ns: "booking" })}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </HStack>
          )}
          {user?.role === userRoles.USER_HOPPER && (
            <View className="gap-5">
              <VStack className="mt-6 gap-3 border border-[#E1F5F3] p-2 rounded-[20px]">
                <Box>
                  <Text fontSize={12} fontWeight={300} textColor={Colors.GRAY}>
                    Punto de partida
                  </Text>
                  <HStack className="items-center gap-2">
                    <Send />
                    <VStack>
                      <Text fontSize={16} fontWeight={400}>
                        {data?.from?.address}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                <Divider style={styles.divider_light} />
                <Box>
                  <Text fontSize={12} fontWeight={300} textColor={Colors.GRAY}>
                    Punto de partida
                  </Text>
                  <HStack className="items-center gap-2">
                    <Send />
                    <VStack>
                      <Text fontSize={16} fontWeight={400}>
                        {data?.to?.address}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </VStack>
              {user.role === userRoles.USER_HOPPER && data?.reducedMobility && (
                <HStack space="md">
                  <View className="rounded-full bg-[#2EC4B6] w-6 h-6 items-center justify-center">
                    <WarningHexa />
                  </View>

                  <Text>
                    {t("home.map_home.third_sheet.accessibility", {
                      ns: "home",
                    })}
                  </Text>
                </HStack>
              )}
            </View>
          )}
          <View style={styles.panel}>
            {(user?.role !== userRoles.USER_HOPPER
              ? filteredShortcuts
              : shortcutsHopper
            ).map(({ name, icon: IconItem }, i) => {
              return (
                <React.Fragment key={i}>
                  <Pressable key={name}>
                    <HStack
                      className="items-center justify-between px-4 w-full rounded-2xl"
                      style={{
                        backgroundColor:
                          hoveredIndex === i ? Colors.SECONDARY : "transparent",
                        paddingVertical: 8,
                      }}
                      onTouchStart={() => handleHover(i, true)}
                      onTouchEnd={() => handleHover(i, false)}
                    >
                      <Box className="flex-row gap-2 items-center w-[80%]">
                        <View style={styles.link_icon}>
                          {IconItem && (
                            <IconItem
                              width={16}
                              height={16}
                              color={Colors.SECONDARY}
                            />
                          )}
                        </View>
                        <Text
                          textColor={Colors.DARK_GREEN}
                          fontWeight={400}
                          fontSize={16}
                        >
                          {name}
                        </Text>
                      </Box>
                    </HStack>
                  </Pressable>
                  {i !==
                    (user?.role !== userRoles.USER_HOPPER
                      ? filteredShortcuts
                      : shortcutsHopper
                    ).length -
                      1 && <Divider style={styles.divider} />}
                </React.Fragment>
              );
            })}
          </View>
          {user?.role === userRoles.USER_HOPPER ? (
            <>
              <Text
                fontSize={16}
                fontWeight={400}
                textColor={Colors.PRIMARY}
                className="mt-2"
                underline
              >
                Enviar link de pago
              </Text>
              <HStack className="mt-8 justify-between items-center">
                <Text fontSize={18} fontWeight={400}>
                  Estado del pago
                </Text>
                <Badge
                  className="rounded-full gap-1"
                  style={{
                    backgroundColor: paymentColor[data?.paymentStatus!],
                  }}
                >
                  {/* @ts-ignore */}
                  <Icon color={paymentTextColor[data?.paymentStatus!]} />
                  <Text
                    fontSize={18}
                    fontWeight={600}
                    textColor={paymentTextColor[data?.paymentStatus!]}
                  >
                    {payment[data?.paymentStatus!]}
                  </Text>
                </Badge>
              </HStack>
              <Box className="mt-8 gap-2">
                {user.role === userRoles.USER_HOPPER && (
                  <Button
                    onPress={() =>
                      router.push({
                        pathname: HomeRoutesLink.MAP_HOPPER,
                        params: {
                          travel: JSON.stringify(data),
                        },
                      })
                    }
                    stretch
                  >
                    Ver ruta en el mapa
                  </Button>
                )}
                <Button
                  onPress={() => {}}
                  stretch
                  type="ghost"
                  textClassName={{
                    color: Colors.GRAY,
                  }}
                >
                  Cancelar viaje
                </Button>
              </Box>
            </>
          ) : (
            <>
              <HStack className="mt-8 justify-around items-center">
                <Text fontSize={18} fontWeight={400}>
                  {t("booking.card.commission", { ns: "booking" })}{" "}
                </Text>
                <Badge className="rounded-full bg-[#9FE4DD] gap-1">
                  <DolarCircle />
                  <Text
                    fontSize={18}
                    fontWeight={600}
                    textColor={Colors.DARK_GREEN}
                  >
                    ${"0"}
                  </Text>
                </Badge>
              </HStack>
              <VStack className="mt-8 gap-4">
                <Button onPress={() => {}} stretch>
                  {t("booking.card.button", { ns: "booking" })}
                </Button>
                <Button
                  onPress={async () => {
                    await updateTravel(id, {
                      status: travelStatus.CANCELLED,
                    });
                    router.back();
                  }}
                  type="ghost"
                  stretch
                  textClassName={{
                    color: "#8e8e8e",
                  }}
                >
                  {t("booking.card.cancel", { ns: "booking" })}
                </Button>
              </VStack>
            </>
          )}
        </>
      ) : (
        <BookingEditForm
          formattedDate={date}
          formattedTime={time}
          data={data!}
          id={id}
          user={user!}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-end",
    alignItems: "center",
    paddingHorizontal: 2,
    paddingVertical: 4,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 40,
    marginTop: 12,
  },
  panel: {
    backgroundColor: Colors.LIGHT_GRADIENT_1,
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 40,
    gap: 12,
  },
  link_icon: {
    alignSelf: "flex-start",
    padding: 8,
    backgroundColor: "white",
    borderRadius: 50,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.PRIMARY,
  },
  divider_light: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.LIGHT_GRADIENT_1,
  },
});
