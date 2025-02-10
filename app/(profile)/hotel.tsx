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
import { Danger, Location } from "@/assets/svg";
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
import {
  checkEmptyFields,
  removeEmptyField,
} from "@/helpers/check-empty-fields";
import { keysToCheck } from "@/constants/check-validations";
import { useRoute } from "@react-navigation/native";
import { Badge } from "@/components/ui/badge";

export default function PersonalData() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
    refreshInterval: 5,
  });
  const route = useRoute();
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

  //   onChangeText={(text) => {
  //     handleChange("bank_account_holder")(text);
  //     removeEmptyField("bank_account_holder", setEmptyFields);
  //   }}
  // error={
  //     (touched.bank_account_holder &&
  //       errors.bank_account_holder) ||
  //     emptyFields.find((item) => item === "bank_account_holder")
  //   }

  const [emptyFields, setEmptyFields] = useState<string[]>(() =>
    checkEmptyFields(
      data?.userInfo || {},
      route.name === "hotel"
        ? keysToCheck.filter((item) =>
            ["hotel_name", "hotel_location"].includes(item)
          )
        : keysToCheck
    )
  );

  console.log(emptyFields);

  return (
    <Container>
      {emptyFields.length > 0 ? (
        <Badge className="rounded-full p-2 gap-2 bg-[#E1F5F3] items-center justify-center">
          <Danger />
          <Text fontSize={14} fontWeight={600}>
            {t("profile.account.empty", { ns: "profile" })}
          </Text>
        </Badge>
      ) : (
        <></>
      )}
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
                  onChangeText={(text) => {
                    handleChange("hotel_name")(text);
                    removeEmptyField("hotel_name", setEmptyFields);
                  }}
                  placeholder=""
                  value={values.hotel_name}
                  error={
                    (touched.hotel_name && errors.hotel_name) ||
                    emptyFields.find((item) => item === "hotel_name")
                  }
                  touched={touched.hotel_name}
                  isDisabled={!isEditable}
                />

                <Input
                  label={t("signup.step_3.address.label")}
                  onBlur={handleBlur("home_address")}
                  onChangeText={(text) => {
                    handleChange("home_address")(text);
                    removeEmptyField("hotel_location", setEmptyFields);
                  }}
                  placeholder=""
                  value={values.home_address || state.hotel_info.address}
                  error={
                    (touched.home_address && errors.home_address) ||
                    emptyFields.find((item) => item === "hotel_location")
                  }
                  touched={touched.home_address}
                  isDisabled={!isEditable}
                />

                {isEditable && (
                  <Pressable onPress={() => requestLocationPermission()}>
                    <HStack space="xs">
                      <Location color={Colors.DARK_GREEN} width={14} />
                      <Text
                        fontWeight={400}
                        fontSize={12}
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
