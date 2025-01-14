import { Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import { validationSchemaS3 } from "@/schemas/register.schema";
import { VStack } from "@/components/ui/vstack";
import Input from "@/components/input/input.component";
import { StepControl } from "@/components/step-controls/step-control.component";
import { useTranslation } from "react-i18next";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Location } from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import * as ExpoLocation from "expo-location";
import { Text } from "@/components/text/text.component";
import { RegisterType } from "@/utils/types/register.type";
import { Button } from "@/components/button/button.component";
import { createUser, login } from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { router } from "expo-router";
import useSWR from "swr";

type formProps = {
  payloadValues: RegisterType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
};

export default function Step3(props: formProps) {
  const { payload, setStep, payloadValues } = props;
  const { t } = useTranslation();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, error, mutate } = useSWR("signup", async () => null, {
    revalidateOnFocus: false,
  });

  const requestLocationPermission = async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso de ubicación denegado");
      return;
    }

    setShowActionsheet(true);
  };

  const handleClose = () => {
    setShowActionsheet(false);
  };

  const handleSignUp = async (values: any) => {
    setLoading(true);
    try {
      await createUser(values);

      const response = await login({
        email: values.email,
        password: values.password,
      });

      await AsyncStorage.setItem(
        "auth_token",
        JSON.stringify({
          token: response.access_token,
          refreshToken: response.refresh_token,
        })
      );

      router.replace(AuthRoutesLink.FINISH_ONBOARDING);
      mutate();
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.formulary} className="pb-4">
        <Text fontSize={16} fontWeight={400}>
          {t("signup.step_3.title")}
        </Text>
        <Formik
          initialValues={{
            bank_name: payloadValues.userInfo.bank_name,
            home_address: payloadValues.userInfo.home_address,
          }}
          validationSchema={validationSchemaS3}
          onSubmit={(values) => {
            handleSignUp(payloadValues);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <VStack space="lg" className="justify-between flex-1 mt-[32px]">
              <Box className="gap-4 mb-12">
                <Input
                  label={t("signup.step_3.hotel_name.label")}
                  onBlur={handleBlur("bank_name")}
                  onChangeText={handleChange("bank_name")}
                  placeholder=""
                  value={values.bank_name}
                  error={touched.bank_name && errors.bank_name}
                  touched={touched.bank_name}
                />

                <Input
                  label={t("signup.step_3.address.label")}
                  onBlur={handleBlur("home_address")}
                  onChangeText={handleChange("home_address")}
                  placeholder=""
                  value={values.home_address}
                  error={touched.home_address && errors.home_address}
                  touched={touched.home_address}
                />
                <Pressable onPress={() => requestLocationPermission()}>
                  <HStack space="xs">
                    <Location color={Colors.PRIMARY} width={14} />
                    <Text
                      className="text-xs font-medium"
                      style={styles.mark_map}
                    >
                      Marcar en el mapa
                    </Text>
                  </HStack>
                </Pressable>
              </Box>
              <Button
                onPress={() => router.replace(AuthRoutesLink.FINISH_ONBOARDING)}
                loading={loading}
              >
                {t("signup.step_3.button")}{" "}
              </Button>
            </VStack>
          )}
        </Formik>
      </View>
      <View style={{ flex: 1, backgroundColor: "red" }}>
        {/* <MapSheet showActionsheet={showActionsheet} handleClose={handleClose} /> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formulary: {
    gap: 16,
    paddingBottom: 120,
  },
  mark_map: {
    color: Colors.PRIMARY,
  },
});
