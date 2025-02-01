import React, { useEffect, useState } from "react";
import { useDrawer } from "@/context/drawer.context";
import { Container, Header } from "@/components";
import { router, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import { Box } from "@/components/ui/box";
import { Avatar, AvatarHopper, Booking, Car, CourtHouse } from "@/assets/svg";
import { Text } from "@/components/text/text.component";
import useSWR from "swr";
import { getUserLogged } from "@/services/auth.service";
import { Colors } from "@/constants/Colors";
import capitalizeWords from "@/helpers/capitalize-words";
import { userRoles } from "@/utils/enum/role.enum";
import { Image, Pressable, StyleSheet, View } from "react-native";

import {
  CalendarActive,
  ClockActive,
  ProfileActive,
  WalletActive,
} from "@/assets/svg";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { useTranslation } from "react-i18next";
import { ProfileRoutesLink } from "@/utils/enum/profile.routes";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function Profile() {
  const { data, isLoading } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
    refreshInterval: 5,
  });
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const drawerState = useDrawerStatus();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isDrawerOpen) {
      navigation.dispatch(DrawerActions.openDrawer());
    } else {
      navigation.dispatch(DrawerActions.closeDrawer());
      setIsDrawerOpen(false);
    }
  }, [isDrawerOpen, setIsDrawerOpen, navigation]);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={t("profile.home.title", { ns: "profile" })}
          menu
          onPressMenu={() => setIsDrawerOpen(true)}
        />
      ),
    });
  }, [navigator]);

  useEffect(() => {
    if (drawerState === "open") {
      setIsDrawerOpen(true);
    }
    if (drawerState === "closed") {
      setIsDrawerOpen(false);
    }
  }, [drawerState, setIsDrawerOpen]);

  const shortcuts = [
    {
      icon: ProfileActive,
      name: t("profile.home.shortcuts.personal_data", { ns: "profile" }),
      to: ProfileRoutesLink.PERSONAL_DATA,
    },
    {
      icon: Car,
      name: t("profile.home.shortcuts.vehicle", { ns: "profile" }),
      to: ProfileRoutesLink.VEHICLE_DATA,
    },
    {
      icon: CourtHouse,
      name: t("profile.home.shortcuts.hotel", { ns: "profile" }),
      to: ProfileRoutesLink.HOTEL,
    },
    {
      icon: CalendarActive,
      name: t("profile.home.shortcuts.reservations", { ns: "profile" }),
    },
    {
      icon: ClockActive,
      name: t("profile.home.shortcuts.history", { ns: "profile" }),
    },
    {
      icon: WalletActive,
      name: t("profile.home.shortcuts.bank_account", { ns: "profile" }),
      to: ProfileRoutesLink.BANK_ACCOUNT,
    },
  ];

  const handleHover = (id: number, isHovered: boolean) => {
    setHoveredIndex(isHovered ? id : null);
  };

  const filteredShortcuts = shortcuts.filter((item) => {
    if (data?.role === userRoles.USER_HOPPER && item.icon === CourtHouse) {
      return false;
    }
    if (data?.role === userRoles.USER_HOPPY && item.icon === Car) {
      return false;
    }
    return true;
  });

  return (
    <Container>
      <Box className="justify-center items-center">
        {data?.userInfo.profilePic ? (
          <Skeleton
            variant="rounded"
            className="rounded-full"
            style={styles.skeleton_image}
            isLoaded={!isLoading}
          >
            <Image
              source={{
                uri: data?.userInfo.profilePic,
              }}
              width={185}
              height={185}
              className="rounded-full"
            />
          </Skeleton>
        ) : data?.role === userRoles.USER_HOPPER ? (
          <AvatarHopper width={185} height={185} />
        ) : (
          <Avatar width={185} height={185} />
        )}
        <SkeletonText isLoaded={!isLoading}>
          <Text
            fontSize={24}
            fontWeight={400}
            textColor={Colors.DARK_GREEN}
            className="mt-2"
          >
            {capitalizeWords(data?.userInfo.firstName || "")}{" "}
            {capitalizeWords(data?.userInfo.lastName || "")}
          </Text>
        </SkeletonText>
        <Text textColor={Colors.SECONDARY} fontWeight={600} fontSize={20}>
          {data?.role === userRoles.USER_HOPPER ? "Hopper" : "Hoppy"}
        </Text>
      </Box>
      <View style={styles.panel}>
        {filteredShortcuts.map(
          (
            { name, icon: IconItem, to }: { name: string; icon: any; to?: any },
            i
          ) => {
            return (
              <Pressable
                onPress={() => router.push(to)}
                disabled={!to}
                key={name}
              >
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
                  <Box className="flex-row gap-2 items-center">
                    <View style={styles.link_icon}>
                      <IconItem
                        width={16}
                        height={16}
                        color={Colors.SECONDARY}
                      />
                    </View>
                    <Text
                      textColor={Colors.DARK_GREEN}
                      fontWeight={400}
                      fontSize={16}
                    >
                      {name}
                    </Text>
                  </Box>
                  <Icon
                    as={ChevronRightIcon}
                    color={Colors.DARK_GREEN}
                    width={12}
                    height={12}
                  />
                </HStack>
                {i !== 4 && <Divider style={styles.divider} />}
              </Pressable>
            );
          }
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Colors.LIGHT_GRADIENT_1,
    marginTop: 80,
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
  skeleton_image: {
    width: 185,
    height: 185,
  },
});
