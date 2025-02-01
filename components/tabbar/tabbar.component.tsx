import React from "react";
import { View, Pressable } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { CustomTabBarProps } from "@/utils/types/tabbar.type";
import { styles } from "./styles";
import { Text } from "../text/text.component";

export const TabBar = (props: CustomTabBarProps) => {
  const { state, descriptors, navigation } = props;

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.dispatch(
              CommonActions.navigate({
                name: route.name,
              })
            );
          }
        };

        return (
          <Pressable
            key={route.key}
            style={[
              styles.tabItem,
              route.name === "index" && styles.indexTabItem,
            ]}
            onPress={onPress}
          >
            <View>
              {options.tabBarIcon &&
                options.tabBarIcon({
                  color: isFocused ? "#FF6347" : "#333",
                  focused: isFocused,
                  size: 0,
                })}
            </View>{" "}
            {isFocused && (
              <Text fontSize={14} style={[isFocused && styles.focusedText]}>
                {String(options.tabBarLabel) || route.name}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};
