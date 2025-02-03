import { Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { validationSchemaS3 } from "@/schemas/register.schema";
import { VStack } from "@/components/ui/vstack";
import Input from "@/components/input/input.component";
import { useTranslation } from "react-i18next";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Location } from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Text } from "@/components/text/text.component";
import { RegisterType } from "@/utils/types/register.type";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { useRequestLocationPermission } from "@/hooks/use-location.hook";
import { useAuth } from "@/context/auth.context";
import { StepControl } from "@/components/step-controls/step-control.component";
import { updateUser } from "@/services/auth.service";
import { UserInfo } from "@/utils/interfaces/auth.interface";
import { useToast } from "@/hooks/use-toast";

type formProps = {
  payloadValues: RegisterType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
  extraData: string;
  role: string;
};

export default function Step3(props: formProps) {
  const { setStep, extraData } = props;
  const { t } = useTranslation();
  const { state, updatePayload } = useAuth();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const schema = validationSchemaS3(t);
  const { requestLocationPermission } = useRequestLocationPermission({
    url: AuthRoutesLink.MAP,
    step: 3,
  });

  const handleRegisterStep3 = async (values: Partial<UserInfo>) => {
    setLoading(true);
    try {
      await updateUser(extraData, values);
      setStep(4);
    } catch (error) {
      showToast({
        message: t("server_error", { ns: "utils" }),
        action: "error",
        duration: 3000,
        placement: "bottom",
      });
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
            hotel_name: "",
            home_address: {
              address: state.hotel_info.address,
              latitude: state.hotel_info.latitude,
              longitude: state.hotel_info.longitude,
            },
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            handleRegisterStep3({
              hotel_name: values.hotel_name,
              hotel_location: {
                address: state.hotel_info.address,
                lat: state.hotel_info.latitude,
                lng: state.hotel_info.longitude,
              },
            });
          }}
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
              <VStack space="lg" className="justify-between flex-1 mt-[32px]">
                <Box className="gap-4 mb-12">
                  <Input
                    label={t("signup.step_3.hotel_name.label")}
                    onBlur={handleBlur("hotel_name")}
                    onChangeText={handleChange("hotel_name")}
                    placeholder=""
                    value={values.hotel_name}
                    error={touched.hotel_name && errors.hotel_name}
                    touched={touched.hotel_name}
                  />

                  {/* <Input
                    label={t("signup.step_3.address.label")}
                    onBlur={handleBlur("home_address")}
                    onChangeText={handleChange("home_address")}
                    placeholder=""
                    value={state.hotel_info.address}
                    error={
                      touched.home_address?.address &&
                      errors.home_address?.address
                    }
                    touched={touched.home_address?.address}
                  /> */}

                  <Input
                    label={t("signup.step_3.address.label", { ns: "auth" })}
                    onBlur={handleBlur("home_address")}
                    onChangeText={(val: string) => {
                      setFieldValue("home_address", val);

                      if (val.trim() === "") {
                        updatePayload({
                          hotel_info: {
                            ...state.hotel_info,
                            home_address: "",
                            latitude: "",
                            longitude: "",
                          },
                        });
                      }
                    }}
                    placeholder=""
                    value={values.home_address as any}
                    error={
                      touched.home_address?.address &&
                      errors.home_address?.address
                    }
                    touched={touched.home_address?.address}
                    stretch
                  />
                  <Pressable onPress={() => requestLocationPermission()}>
                    <HStack space="xs">
                      <Location color={Colors.PRIMARY} width={14} />
                      <Text
                        className="text-xs font-medium"
                        style={styles.mark_map}
                      >
                        {t("signup.step_1.mark_map", { ns: "auth" })}
                      </Text>
                    </HStack>
                  </Pressable>
                </Box>
                <StepControl
                  handleBack={() => setStep(4)}
                  handleNext={handleSubmit}
                  textBack={t("signup.step_2.buttons.skip", {
                    ns: "auth",
                  })}
                  textNext={t("signup.step_2.buttons.next", {
                    ns: "auth",
                  })}
                  color={Colors.GRAY}
                  vertical
                />
              </VStack>
            );
          }}
        </Formik>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formulary: {
    gap: 16,
    paddingBottom: 120,
    flex: 1,
  },
  mark_map: {
    color: Colors.DARK_GREEN,
  },
});
