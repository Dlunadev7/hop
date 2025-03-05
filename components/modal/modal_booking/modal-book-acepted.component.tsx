import { Image, StyleSheet, View } from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/text/text.component";
import { useTranslation } from "react-i18next";
import {
  AvatarHopper,
  CalendarActive,
  ClockActive,
  DolarCircle,
  Star,
  Ticket,
  UserSquare,
} from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/components/button/button.component";
import { router } from "expo-router";
import { HomeRoutesLink } from "@/utils/enum/home.routes";
import { Center } from "@/components/ui/center";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { CloseCircleIcon, Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

const userHopper = {
  userInfo: {
    firstName: "John",
    lastName: "Doe",
    profilePic: null,
  },
};

const data = {
  carType: "SUV",
  numberOfPassengers: 3,
  price: 150.0,
  hoppyCommission: 15,
};

const vehicleName: Record<string, string> = {
  SUV: "Toyota Highlander",
  Sedan: "Honda Accord",
};

const parsedFormattedDate = "2024-09-05";
const time = "10:30 AM";

export const ModalBook = (props: {
  isOpen: boolean;
  handleClose: VoidFunction;
}) => {
  const { isOpen, handleClose } = props;
  const { t } = useTranslation();
  return (
    <Center className="h-auto w-[100%] bg-slate-800">
      <Modal
        isOpen={isOpen}
        onClose={() => handleClose()}
        style={{ paddingHorizontal: 16 }}
      >
        <ModalBackdrop />
        <ModalContent className="rounded-[20px] bg-[#E1F5F3] w-[100%]">
          <ModalHeader className="justify-end">
            {/* <Text fontSize={18} fontWeight={400} textColor={Colors.GRAY}>
              Nueva solicitud
            </Text> */}
            <ModalCloseButton onPress={() => {}} className="items-end">
              <Icon as={CloseCircleIcon} size="md" color={Colors.GRAY} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md" className="items-center gap-8">
              <Text fontSize={24} fontWeight={400} textAlign="center">
                {`${userHopper?.userInfo.firstName} ${userHopper?.userInfo.lastName}`}{" "}
                {t("home.map_home.fifty_sheet.accept_reservation", {
                  ns: "home",
                })}
              </Text>

              <VStack className="items-center gap-2">
                {userHopper?.userInfo.profilePic ? (
                  <Image
                    source={{
                      uri: userHopper?.userInfo.profilePic,
                    }}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                ) : (
                  <AvatarHopper width={120} height={120} />
                )}
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
                    backgroundColor: Colors.WHITE,
                    height: 44,
                    width: 300,
                  }}
                >
                  {/* {Icon} */}
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
                    backgroundColor: Colors.WHITE,
                    height: 44,
                    width: 300,
                  }}
                >
                  <CalendarActive width={28} height={28} />
                  <Text fontSize={16} fontWeight={400}>
                    {parsedFormattedDate ? parsedFormattedDate : ""}
                  </Text>
                  <ClockActive width={28} height={28} />
                  <Text fontSize={16} fontWeight={400}>
                    {time ? time : ""}
                  </Text>
                </HStack>
                <HStack
                  className="rounded-full py-2 px-6 items-center gap-2"
                  style={{
                    backgroundColor: Colors.WHITE,
                    height: 44,
                    width: 300,
                  }}
                >
                  <UserSquare />
                  <Text fontSize={16} fontWeight={400}>
                    Ricardo Darin
                  </Text>
                  {/* <Ticket width={35} height={35} /> */}
                  {/* <Text fontSize={16} fontWeight={400}>
                    {t("home.map_home.fifty_sheet.value", { ns: "home" })}
                  </Text> */}
                  {/* <Text textColor={Colors.GRAY} fontWeight={400}>
                    ${data.price ? data.price.toFixed(2) : 0}
                  </Text> */}
                </HStack>
                <HStack className="w-full justify-between items-center">
                  <Text
                    fontSize={14}
                    fontWeight={400}
                    textColor={Colors.DARK_GREEN}
                  >
                    {t("home.map_home.fifty_sheet.value", { ns: "home" })}
                  </Text>
                  <Badge style={styles.badge}>
                    <DolarCircle />
                    <Text
                      fontSize={18}
                      fontWeight={600}
                      textColor={Colors.DARK_GREEN}
                    >
                      $ {"0"}
                    </Text>
                  </Badge>
                </HStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter className="flex-col">
            <Box className="w-full gap-4">
              <Button
                onPress={() =>
                  router.replace({
                    pathname: HomeRoutesLink.CONFIRMATION,
                    params: {
                      commission: data.hoppyCommission,
                      title: t("home.confirmation.title", { ns: "home" }),
                      subtitle: t("home.confirmation.subtitle", {
                        ns: "home",
                      }),
                    },
                  })
                }
                stretch
              >
                Ver comision
              </Button>
              <Button
                onPress={() =>
                  router.navigate({
                    pathname: "/(booking)/[id]",
                    params: {
                      id: "travelParsed.id",
                    },
                  })
                }
                textClassName={{
                  color: Colors.GRAY,
                }}
                type="ghost"
                stretch
              >
                mas info
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-end",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 40,
  },
});
