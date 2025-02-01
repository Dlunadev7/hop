import React from "react";
import { HStack } from "../ui/hstack";
import { Text } from "../text/text.component";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeftColored,
  ArrowLeftRounded,
  Avatar,
  Edit,
  Menu,
} from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Pressable, View } from "react-native";

type HeaderProps = {
  title: string;
  avatar?: boolean;
  menu?: boolean;
  edit?: boolean;
  arrow?: boolean;
  onPressArrow?: VoidFunction;
  onPressEdit?: VoidFunction;
  onPressMenu?: VoidFunction;
};

export const Header = (props: HeaderProps) => {
  const {
    title,
    avatar,
    menu,
    edit,
    arrow,
    onPressArrow,
    onPressEdit,
    onPressMenu,
  } = props;
  const insets = useSafeAreaInsets();

  return (
    <HStack
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: 12,
        backgroundColor: Colors.WHITE,
      }}
      className="items-center px-4 justify-between"
    >
      <View className="flex-row gap-2 items-center">
        {arrow && (
          <Pressable onPress={() => onPressArrow?.()}>
            <ArrowLeftColored />
          </Pressable>
        )}
        <Text fontSize={24} fontWeight={400}>
          {title || ""}
        </Text>
      </View>
      {avatar && <Avatar />}
      {menu && (
        <Pressable onPress={() => onPressMenu?.()}>
          <Menu />
        </Pressable>
      )}
      {edit && (
        <Pressable onPress={() => onPressEdit?.()}>
          <Edit width={36} height={36} />
        </Pressable>
      )}
    </HStack>
  );
};
