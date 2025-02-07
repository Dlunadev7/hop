import React from "react";
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
import { Text } from "@/components/text/text.component";
import { CloseCircleIcon, Icon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";
import {
  Booking,
  Calendar,
  Clock,
  DolarCircle,
  LocationFilled,
  People,
  Send,
  ShoppingBag,
} from "@/assets/svg";
import { Badge } from "@/components/ui/badge";
import { Colors } from "@/constants/Colors";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/button/button.component";
import { StyleSheet } from "react-native";
import { formattedDate } from "@/helpers/parse-date";

export const ModalBooking = ({ isOpen, handleClose }: any) => {
  const { date, time } = formattedDate(new Date());

  return (
    <Center className="h-auto w-[100%] bg-slate-800">
      <Modal
        isOpen={isOpen}
        onClose={() => handleClose()}
        style={{ paddingHorizontal: 16 }}
      >
        <ModalBackdrop />
        <ModalContent className="rounded-[20px] bg-[#E1F5F3] w-[100%]">
          <ModalHeader>
            <Text fontSize={18} fontWeight={400} textColor={Colors.GRAY}>
              Nueva solicitud
            </Text>
            <ModalCloseButton onPress={() => handleClose()}>
              <Icon as={CloseCircleIcon} size="md" color={Colors.GRAY} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Box className="mt-4 flex-row gap-2 items-center">
              <Booking width={28} height={28} />
              <Text fontSize={20} fontWeight={600}>
                Pick up
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
                    Aeropuerto El Dorado
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
                    Aeropuerto El Dorado
                  </Text>
                </Box>
              </VStack>
            </Box>
            <VStack className="mt-4">
              <Box className="flex-row gap-2 items-center">
                <People width={16} height={16} />
                <Text
                  textColor={Colors.DARK_GREEN}
                  fontSize={18}
                  fontWeight={400}
                >
                  4 Pasajeros
                </Text>
              </Box>
              <Box className="flex-row gap-2 items-center">
                <ShoppingBag width={16} height={16} />
                <Text
                  textColor={Colors.DARK_GREEN}
                  fontSize={18}
                  fontWeight={400}
                >
                  2 maletas
                </Text>
              </Box>
              <Box className="flex-row gap-2 items-center">
                <DolarCircle width={16} height={16} />
                <Text
                  textColor={Colors.DARK_GREEN}
                  fontSize={18}
                  fontWeight={400}
                >
                  Valor del viaje $4.056
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter className="flex-col">
            <Button onPress={() => handleClose()} stretch>
              Aceptar Viaje
            </Button>
            <Button
              type="ghost"
              onPress={() => handleClose()}
              stretch
              textClassName={{
                color: Colors.GRAY,
              }}
            >
              Rechazar viaje
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
};

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
});
