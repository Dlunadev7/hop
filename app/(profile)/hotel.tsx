import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Container, Header, Input } from "@/components";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { getUserLogged, updateUser } from "@/services/auth.service";
import { Location } from "@/assets/svg";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/components/button/button.component";
import { Formik } from "formik";
import { Text } from "@/components/text/text.component";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/auth.context";
import { useRequestLocationPermission } from "@/hooks/use-location.hook";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { useToast } from "@/hooks/use-toast";
import { validationSchemaS3 } from "@/schemas/register.schema";

export default function PersonalData() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
    refreshInterval: 5,
  });
  const { state, updatePayload } = useAuth();
  const { requestLocationPermission } = useRequestLocationPermission({
    url: AuthRoutesLink.MAP,
    step: 3,
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  const schema = validationSchemaS3(t);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={t("profile.hotel.title", { ns: "profile" })}
          edit={!isEditable}
          arrow
          onPressArrow={() => router.back()}
          onPressEdit={() => setIsEditable(true)}
        />
      ),
    });
  }, [navigator, isEditable]);

  const handleSubmit = async (values: { hotel_name: string }) => {
    setLoading(true);

    try {
      await updateUser(data?.id!, {
        hotel_name: values.hotel_name,
        ...(state.hotel_info.address &&
          state.hotel_info.latitude &&
          state.hotel_info.longitude && {
            hotel_location: {
              address: state.hotel_info.address,
              lat: state.hotel_info.latitude,
              lng: state.hotel_info.longitude,
            },
          }),
      });
      router.back();
    } catch (error) {
      showToast({
        message: t("server_error", { ns: "utils" }),
        action: "error",
        duration: 3000,
        placement: "bottom",
      });
    } finally {
      updatePayload({
        hotel_info: {
          address: "",
          latitude: "",
          longitude: "",
        },
      });
      setLoading(false);
    }
  };

  return (
    <Container>
      <Formik
        initialValues={{
          hotel_name: data?.userInfo.hotel_name || "",
          home_address:
            data?.userInfo.hotel_location?.address || state.hotel_info.address,
        }}
        validationSchema={schema}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => {
          useEffect(() => {
            if (state.hotel_info.address) {
              setFieldValue("home_address", state.hotel_info.address);
            }
          }, [state.hotel_info.address]);

          return (
            <VStack className="mt-12 gap-4" style={styles.content}>
              <Box className="gap-4 mb-12">
                <Input
                  label={t("signup.step_3.hotel_name.label")}
                  onBlur={handleBlur("hotel_name")}
                  onChangeText={handleChange("hotel_name")}
                  placeholder=""
                  value={values.hotel_name}
                  error={touched.hotel_name && errors.hotel_name}
                  touched={touched.hotel_name}
                  isDisabled={!isEditable}
                />

                <Input
                  label={t("signup.step_3.address.label")}
                  onBlur={handleBlur("home_address")}
                  onChangeText={handleChange("home_address")}
                  placeholder=""
                  value={values.home_address || state.hotel_info.address}
                  error={touched.home_address && errors.home_address}
                  touched={touched.home_address}
                  isDisabled={!isEditable}
                />

                {isEditable && (
                  <Pressable onPress={() => requestLocationPermission()}>
                    <HStack space="xs">
                      <Location color={Colors.DARK_GREEN} width={14} />
                      <Text
                        className="text-xs font-medium"
                        textColor={Colors.DARK_GREEN}
                      >
                        {t("signup.step_1.mark_map", { ns: "auth" })}
                      </Text>
                    </HStack>
                  </Pressable>
                )}
              </Box>

              {isEditable && (
                <Button onPress={() => handleSubmit()}>
                  {loading ? (
                    <ActivityIndicator color={Colors.WHITE} />
                  ) : (
                    t("profile.personal_data.button", { ns: "profile" })
                  )}
                </Button>
              )}
            </VStack>
          );
        }}
      </Formik>
    </Container>
  );
}

const styles = StyleSheet.create({
  formulary: {
    gap: 16,
  },
  mark_map: {
    color: Colors.DARK_GREEN,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    height: Dimensions.get("screen").height - 185,
  },
});
