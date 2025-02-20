import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "../(profile)/index";
import { Header } from "@/components";
import { Colors } from "@/constants/Colors";
import { View, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/text/text.component";
import { Divider } from "@/components/ui/divider";
import { useAuth } from "@/context/auth.context";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { useDrawer } from "@/context/drawer.context";
import { useTranslation } from "react-i18next";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { clearToken } = useAuth();
  const { setIsDrawerOpen } = useDrawer();

  const handleLogout = () => {
    clearToken();
    router.replace(AuthRoutesLink.SIGN_IN);
    setIsDrawerOpen(false);
  };

  return (
    <View
      style={{
        backgroundColor: Colors.LIGHT_GRADIENT_1,
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 8,
      }}
      className="flex-1"
    >
      <View className="p-5">
        <Pressable onPress={() => router.push("/(settings)/")} className="p-2">
          <Text textColor={Colors.DARK_GREEN} fontSize={20} fontWeight={400}>
            {t("profile.drawer.link.permissions", { ns: "profile" })}
          </Text>
          <Divider
            className="my-1"
            orientation="horizontal"
            style={styles.divider}
          />
        </Pressable>
        <Pressable
          onPress={() => router.push(AuthRoutesLink.NEW_PASSWORD)}
          className="p-2"
        >
          <Text textColor={Colors.DARK_GREEN} fontSize={20} fontWeight={400}>
            {t("profile.drawer.link.privacy", { ns: "profile" })}
          </Text>
          <Divider className="my-1" style={styles.divider} />
        </Pressable>
        <Pressable
          onPress={() => router.push("/(settings)/report_issue")}
          className="p-2"
        >
          <Text textColor={Colors.DARK_GREEN} fontSize={20} fontWeight={400}>
            {t("profile.drawer.link.report_issue", { ns: "profile" })}
          </Text>
          <Divider className="my-1" style={styles.divider} />
        </Pressable>
      </View>

      <View className="flex-1" />

      <View className="p-5">
        <Pressable onPress={() => handleLogout()}>
          <Text textColor={Colors.DARK_GREEN} fontSize={20} fontWeight={400}>
            {t("profile.drawer.link.logout", { ns: "profile" })}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function ProfileDrawerLayout() {
  return (
    <Drawer.Navigator
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
        header: () => <Header title="Perfil" menu />,
        drawerType: "front",
        drawerContentContainerStyle: {
          flex: 1,
        },
        drawerContentStyle: {
          backgroundColor: Colors.LIGHT_GRADIENT_1,
        },
      }}
      drawerContent={() => <CustomDrawerContent />}
    >
      <Drawer.Screen
        name="index"
        component={Profile}
        options={{ title: "Profile" }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: Colors.PRIMARY,
    height: 1,
    width: "100%",
    marginTop: 12,
  },
});
