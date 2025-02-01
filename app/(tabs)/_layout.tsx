import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { TabBar } from "@/components/tabbar/tabbar.component";
import { TabsRoutes } from "@/utils/enum/tabs.routes";
import {
  Calendar,
  CalendarActive,
  Clock,
  ClockActive,
  Home,
  HomeActive,
  Profile,
  ProfileActive,
  Wallet,
  WalletActive,
} from "@/assets/svg";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Animated } from "react-native";
import { Colors } from "@/constants/Colors";
import { useDrawer } from "@/context/drawer.context";

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDrawerOpen } = useDrawer();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [translateYAnim] = useState(new Animated.Value(0));
  const [paddingBottomAnim] = useState(new Animated.Value(100));

  useEffect(() => {
    if (isDrawerOpen) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();

      Animated.timing(translateYAnim, {
        toValue: 50,
        duration: 100,
        useNativeDriver: true,
      }).start();

      Animated.timing(paddingBottomAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();

      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();

      Animated.timing(paddingBottomAnim, {
        toValue: 100,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [isDrawerOpen]);

  return (
    <View style={styles.tabbar_container}>
      <Tabs
        tabBar={(props) => {
          return (
            <Animated.View
              style={[
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: translateYAnim }],
                  display: isDrawerOpen ? "none" : "flex",
                },
              ]}
            >
              <TabBar {...props} />
            </Animated.View>
          );
        }}
      >
        <Tabs.Screen
          name={TabsRoutes.BOOKING}
          options={{
            tabBarLabel: t("tabbar.booking", { ns: "utils" }),
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <CalendarActive color={color} />
              ) : (
                <Calendar color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name={TabsRoutes.HISTORY}
          options={{
            tabBarLabel: t("tabbar.history", { ns: "utils" }),
            tabBarIcon: ({ color, focused }) =>
              focused ? <ClockActive /> : <Clock color={color} />,
          }}
        />
        <Tabs.Screen
          name={TabsRoutes.HOME}
          options={{
            tabBarLabel: t("tabbar.home", { ns: "utils" }),
            tabBarIcon: ({ color, focused }) =>
              focused ? <HomeActive color={color} /> : <Home color={color} />,
          }}
        />
        <Tabs.Screen
          name={TabsRoutes.PROFILE}
          options={{
            tabBarLabel: t("tabbar.profile", { ns: "utils" }),
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <ProfileActive color={color} />
              ) : (
                <Profile color={color} />
              ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name={TabsRoutes.WALLET}
          options={{
            tabBarLabel: t("tabbar.wallet", { ns: "utils" }),
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <WalletActive color={color} />
              ) : (
                <Wallet color={color} />
              ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar_container: {
    backgroundColor: Colors.WHITE,
    height: 100,
    flex: 1,
  },
});
