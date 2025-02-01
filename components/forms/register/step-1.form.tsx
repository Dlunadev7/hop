import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { validationSchema } from "@/schemas/register.schema";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Input from "@/components/input/input.component";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button/button.component";
import { Text } from "@/components/text/text.component";
import { Colors } from "@/constants/Colors";
import { Box } from "@/components/ui/box";
import { Location } from "@/assets/svg";
import { useRequestLocationPermission } from "@/hooks/use-location.hook";
import { useAuth } from "@/context/auth.context";
import { createUser, login } from "@/services/auth.service";
import { ErrorWithStatus } from "@/utils/interfaces/error.interface";
import { useToast } from "@/hooks/use-toast";
import { RegisterType } from "@/utils/types/register.type";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetFlatList,
} from "@/components/ui/actionsheet";
import { ActionsheetDragIndicatorWrapper } from "@/components/ui/select/select-actionsheet";
import { SearchIcon } from "@/components/ui/icon";
import { useGetCoordinatesFromAddress } from "@/hooks/get-direction.hook";

type formProps = {
  payloadValues: RegisterType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
  role: string;
  extraData: string;
};

export default function Step1(props: formProps) {
  const { setStep, setId, role } = props;
  const { t } = useTranslation();
  const { state, setToken, updatePayload } = useAuth();
  const { showToast } = useToast();
  const { requestLocationPermission } = useRequestLocationPermission({
    url: AuthRoutesLink.MAP,
    step: 1,
  });
  const { locations, setSelectedLocation, geocodeAddress } =
    useGetCoordinatesFromAddress();
  const formikRef = useRef<any>(null);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const schema = validationSchema(t);
  const handleSearch = (searchText: string) => {
    if (searchText.trim()) {
      geocodeAddress(searchText);
    }
  };

  const storeTokens = async (token: string, refreshToken: string) => {
    const tokenData = JSON.stringify({ token, refreshToken });

    setToken(tokenData);
  };

  const handleRegisterUser = async (values: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const data = await createUser({
        email: values.email,
        password: values.password,
        role: role,
        userInfo: {
          home_address: {
            address: state.user_info.address,
            lat: state.user_info.latitude,
            lng: state.user_info.longitude,
          },
          bank_account_holder: "",
          bank_account_rut: "",
        },
      });

      const response = await login({
        email: values.email,
        password: values.password,
      });

      await storeTokens(response.access_token, response.refresh_token);

      setId(data.id);
      setStep(2);
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "status" in err) {
        const errorWithStatus = err as ErrorWithStatus;
        if (errorWithStatus.status === 409) {
          showToast({
            message: t("signup.step_1.email_exists", { ns: "auth" }),
            action: "error",
            duration: 3000,
            placement: "bottom",
          });
          return;
        }
        showToast({
          message: t("server_error", { ns: "utils" }),
          action: "error",
          duration: 3000,
          placement: "bottom",
        });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formulary} className="pb-4">
      <Text fontSize={16} fontWeight={400}>
        {t("signup.step_1.title", { ns: "auth" })}
      </Text>
      <Formik
        innerRef={formikRef}
        initialValues={{
          email: "",
          password: "",
          address: state.user_info.address,
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          handleRegisterUser(values);
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
            if (state.user_info.address) {
              setFieldValue("address", state.user_info.address);
            }
          }, [state.user_info.address]);

          return (
            <>
              <VStack space="md">
                <Input
                  label={t("signup.step_1.email.label", { ns: "auth" })}
                  onBlur={handleBlur("email")}
                  onChangeText={handleChange("email")}
                  placeholder=""
                  value={values.email}
                  error={touched.email && errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Input
                  label={t("signup.step_1.password.label", { ns: "auth" })}
                  placeholder=""
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  touched={touched.password}
                  error={touched.password && errors.password}
                  rightIcon
                />

                <Box className="gap-4 ">
                  <Input
                    label={t("signup.step_1.address.label", { ns: "auth" })}
                    onBlur={handleBlur("address")}
                    onChangeText={(val: string) => {
                      setFieldValue("address", val);

                      if (val.trim() === "") {
                        updatePayload({
                          user_info: {
                            ...state.user_info,
                            address: "",
                            latitude: "",
                            longitude: "",
                          },
                        });
                      }
                    }}
                    placeholder=""
                    value={
                      values.address
                        ? values.address
                        : String(state.user_info.address)
                    }
                    error={touched?.address && errors?.address}
                    touched={touched?.address}
                    stretch
                    onPress={() => setShowActionsheet(true)}
                    editable={
                      Boolean(values.address) ||
                      Boolean(state.user_info.address)
                    }
                    pressable={
                      !Boolean(values.address) ||
                      !Boolean(state.user_info.address)
                    }
                  />

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
                </Box>
                <VStack className="mt-[24px] gap-5 w-full items-center">
                  <Button
                    style={{ alignSelf: "center" }}
                    onPress={() => handleSubmit()}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.WHITE} />
                    ) : (
                      t("signup.step_1.next", { ns: "auth" })
                    )}
                  </Button>
                  <Text fontSize={14} fontWeight={300} textColor={Colors.BLACK}>
                    {t("signup.step_1.already_have_account", { ns: "auth" })}{" "}
                    <Text
                      fontSize={14}
                      fontWeight={600}
                      onPress={() => router.push(AuthRoutesLink.SIGN_IN)}
                    >
                      {t("signup.step_1.sign_in", { ns: "auth" })}
                    </Text>
                  </Text>
                </VStack>
              </VStack>
              <Actionsheet
                isOpen={showActionsheet}
                onClose={() => setShowActionsheet(false)}
                snapPoints={[70]}
              >
                <ActionsheetBackdrop />
                <ActionsheetContent className="pb-10">
                  <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                  </ActionsheetDragIndicatorWrapper>
                  <View style={styles.search_bar_container}>
                    <Input
                      placeholder={t("map_sheet", { ns: "utils" })}
                      label=""
                      onBlur={() => {}}
                      onChangeText={handleSearch}
                      className=""
                      icon={SearchIcon}
                      rightIcon
                      size="sm"
                    />
                  </View>
                  <ActionsheetFlatList
                    data={locations}
                    renderItem={({ item }: any) => (
                      <>
                        <Pressable
                          onPress={() => {
                            setSelectedLocation(item);
                            setFieldValue(
                              "address",
                              `${item.name.split(",")[0]},${
                                item.name.split(",")[1]
                              }.`
                            );
                            setShowActionsheet(false);
                          }}
                          className="py-2.5 px-4 border-b border-[#9FE4DD] bg-white rounded-lg mb-2.5"
                        >
                          <Box className="gap-4">
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "500",
                                color: "#333",
                              }}
                            >
                              {item.name}
                            </Text>
                          </Box>
                        </Pressable>
                      </>
                    )}
                    contentContainerClassName="gap-4"
                    keyExtractor={(item: any) => item.id.toString()}
                  />
                </ActionsheetContent>
              </Actionsheet>
            </>
          );
        }}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  formulary: {
    gap: 16,
    flex: 1,
  },
  search_bar_container: {
    width: "100%",
    marginBottom: 24,
    marginTop: 24,
  },
});
