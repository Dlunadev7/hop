import { Tabs } from "expo-router";
import React from "react";
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
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      tabBar={(props) => (
        <View style={styles.tabbar_container}>
          <TabBar {...props} />
        </View>
      )}
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
        }}
      />
      <Tabs.Screen
        name={TabsRoutes.WALLET}
        options={{
          tabBarLabel: t("tabbar.wallet", { ns: "utils" }),
          tabBarIcon: ({ color, focused }) =>
            focused ? <WalletActive color={color} /> : <Wallet color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabbar_container: {
    backgroundColor: Colors.WHITE,
    height: 100,
  },
});
