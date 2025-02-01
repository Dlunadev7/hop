import React from "react";
import { HStack } from "../ui/hstack";
import { Text } from "../text/text.component";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/assets/svg";
import { Colors } from "@/constants/Colors";

type HeaderProps = {
  title: string;
  avatar?: boolean;
};

export const Header = (props: HeaderProps) => {
  const { title, avatar } = props;
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
      <Text fontSize={24} fontWeight={400}>
        {title || ""}
      </Text>
      {avatar && <Avatar />}
    </HStack>
  );
};
