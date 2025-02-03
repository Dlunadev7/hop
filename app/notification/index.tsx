import React, { Fragment, useEffect, useState } from "react";
import { Container, Header } from "@/components";
import { Text } from "@/components/text/text.component";
import { router, useNavigation } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar, DolarCircle, Wallet } from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Divider } from "@/components/ui/divider";
import { CloseCircleIcon, Icon } from "@/components/ui/icon";

export default function Notifications() {
  const navigator = useNavigation();

  const [notifications, setNotifications] = useState([
    {
      icon: Wallet,
      message:
        "¡Buenas noticias! Se han acreditado $41.576 en su cuenta bancaria.",
      date: "12/01/2025",
    },
    {
      icon: Wallet,
      message:
        "¡Felicitaciones! El viaje realizado el 12/01 generó $123. Las ganancias hasta ahora son de $41.576.",
      date: "12/01/2025",
    },
    {
      icon: Avatar,
      message:
        "El Hopper Enrique Romero ha cancelado el viaje. Hemos enviado una notificación al pasajero, asegúrese de realizar una nueva reserva.",
      date: "12/01/2025",
    },
    {
      icon: Wallet,
      message: "El pasajero Ricardo Darin ha concluido su viaje exitosamente.",
      date: "12/01/2025",
    },
    {
      icon: Avatar,
      message:
        "El Hopper Maria Victora ha cancelado el viaje. Hemos enviado una notificación al pasajero, asegúrese de realizar una nueva reserva.",
      date: "12/01/2025",
    },
    {
      icon: DolarCircle,
      message:
        "¡Buenas noticias! Se han acreditado $21.576 en su cuenta bancaria.",
      date: "12/01/2025",
    },
    {
      icon: Wallet,
      message: "El pasajero Laura Palmer ha concluido su viaje exitosamente.",
      date: "12/01/2025",
    },
    {
      icon: Wallet,
      message: "El pasajero Ricardo Darin ha concluido su viaje exitosamente.",
      date: "12/01/2025",
    },
  ]);

  const handleRemoveNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    navigator.setOptions({
      header: () => (
        <Header
          title="Notifications"
          arrow
          onPressArrow={() => router.back()}
        />
      ),
    });
  }, [navigator]);

  return (
    <Container>
      <VStack space="md" style={styles.content} className="gap-5">
        {notifications.map(
          ({ date, message, icon: NotificationIcon }, index) => (
            <Fragment key={index}>
              <HStack key={index} className="items-start space-x-4 gap-3">
                <View className="p-3 rounded-full bg-[#E1F5F3]">
                  {NotificationIcon && (
                    <NotificationIcon width={24} height={24} color="#059669" />
                  )}
                </View>
                <Box className="flex-1 gap-1">
                  <Text
                    textColor={Colors.DARK_GREEN}
                    fontWeight={400}
                    fontSize={14}
                  >
                    {message}
                  </Text>
                  <Text fontSize={10} fontWeight={300} textColor={Colors.GRAY}>
                    {date}
                  </Text>
                </Box>
                <Pressable onPress={() => handleRemoveNotification(index)}>
                  <Icon
                    as={CloseCircleIcon}
                    color={Colors.GRAY}
                    style={styles.delete_notification}
                  />
                </Pressable>
              </HStack>
              {index !== notifications.length - 1 && (
                <Divider style={styles.divider} />
              )}
            </Fragment>
          )
        )}
      </VStack>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 36,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.PRIMARY,
  },
  delete_notification: {
    width: 14,
    height: 14,
  },
});
