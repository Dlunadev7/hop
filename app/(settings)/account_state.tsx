import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { Container, Header } from "@/components";
import { Text } from "@/components/text/text.component";
import Switch from "@/components/switch/switch.comonent";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { Pressable, StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";
import { Colors } from "@/constants/Colors";
import {
  getUserLogged,
  updateUser,
  updateUserOne,
} from "@/services/auth.service";
import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { Icon } from "@/components/ui/icon";
import { InfoCircle } from "@/assets/svg";

export default function AccountState() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data: user } = useSWR("/user/logged", getUserLogged);
  const { showToast } = useToast();

  const [toggleSwitch, setToggleSwitch] = useState(user?.isActive!);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={t("settings.account_state", { ns: "utils" })}
          arrow
          onPressArrow={() => router.back()}
        />
      ),
    });
  }, [navigation]);

  const handleDeactivateAccount = async () => {
    try {
      await updateUserOne(user?.id!, {
        isActive: false,
        email: user?.email,
      });

      router.replace(AuthRoutesLink.SIGN_IN);
    } catch (error) {
      showToast({
        message: t("server_error", { ns: "utils" }),
        action: "error",
        duration: 3000,
        placement: "bottom",
      });

      console.log(error);
    }
  };

  return (
    <Container>
      <Box style={styles.box} className="items-start justify-center gap-4 mt-8">
        <HStack className="justify-between w-full">
          <Text fontSize={20} fontWeight={400} textColor={Colors.DARK_GREEN}>
            {t("settings.account_active", { ns: "utils" })}
          </Text>
          <Switch
            onToggleSwitch={() => {
              setToggleSwitch(!toggleSwitch);
              handleDeactivateAccount();
            }}
            isOn={toggleSwitch}
          />
        </HStack>
      </Box>
      <HStack className="mt-8 gap-2 items-start">
        <Icon as={InfoCircle} />
        <Text className="w-[90%]">
          {t("settings.deactivate_account", { ns: "utils" })}
        </Text>
      </HStack>
    </Container>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.LIGHT_GRADIENT_1,
    borderRadius: 40,
    paddingHorizontal: 40,
    paddingVertical: 15.5,
  },
  divider: {
    backgroundColor: Colors.PRIMARY,
    height: 1,
    width: "100%",
  },
});
