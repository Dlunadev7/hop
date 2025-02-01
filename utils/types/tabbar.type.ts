import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabDescriptorMap } from "@react-navigation/bottom-tabs/lib/typescript/commonjs/src/types";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

export type CustomTabBarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  navigation: any;
  insets: any;
};
