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
import { getUserLogged } from "@/services/auth.service";
import useSWR from "swr";
import { useAuth } from "@/context/auth.context";
import { userRoles } from "@/utils/enum/role.enum";
import { getNotifications } from "@/services/notification.service";
import { FlatList } from "react-native-gesture-handler";

export default function Notifications() {
  const navigator = useNavigation();

  const { data: dataUser } = useSWR("/user/logged", getUserLogged);
  const [page, setPage] = useState(0);
  const [notificationDataPaginated, setNotificationDataPaginated] = useState<
    any[]
  >([]);
  const { data } = useSWR(
    ["/notifications/", page],
    () => getNotifications(dataUser?.id!),
    {
      refreshInterval: 1000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (data?.result) {
      setPage(0);
    }
  }, [data?.result]);

  useEffect(() => {
    if (data?.result) {
      setNotificationDataPaginated((prevData) => {
        const newData = [...prevData];
        data.result.forEach((newItem) => {
          const existingItemIndex = newData.findIndex(
            (existingItem) => existingItem.id === newItem.id
          );

          if (existingItemIndex !== -1) {
            newData[existingItemIndex] = newItem;
          } else {
            newData.push(newItem);
          }
        });

        return newData;
      });
    }
  }, [data?.result]);

  const handleEndReached = () => {
    if (
      data?.pagination &&
      data.pagination.page < data.pagination.totalPages - 1
    ) {
      setPage(page + 1);
    }
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

  console.log(notificationDataPaginated, page);

  return (
    <Container>
      <VStack space="md" style={styles.content} className="gap-5">
        <FlatList
          data={notificationDataPaginated}
          keyExtractor={(_, index) => index.toString()}
          contentContainerClassName="gap-5"
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          renderItem={({ item, index }) => {
            const { date, message, icon: NotificationIcon } = item;

            return (
              <>
                <HStack className="items-start space-x-4 gap-3">
                  <View className="p-3 rounded-full bg-[#E1F5F3]">
                    {NotificationIcon && (
                      <NotificationIcon
                        width={24}
                        height={24}
                        color="#059669"
                      />
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
                    <Text
                      fontSize={10}
                      fontWeight={300}
                      textColor={Colors.GRAY}
                    >
                      {date}
                    </Text>
                  </Box>
                  <Pressable onPress={() => {}}>
                    <Icon
                      as={CloseCircleIcon}
                      color={Colors.GRAY}
                      style={styles.delete_notification}
                    />
                  </Pressable>
                </HStack>
                {index !== notificationDataPaginated.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </>
            );
          }}
        />
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
    marginTop: 12,
  },
  delete_notification: {
    width: 14,
    height: 14,
  },
});
