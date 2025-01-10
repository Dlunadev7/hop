import { Keyboard, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Hop } from "@/assets/svg";
import { Text } from "@/components/ui/text";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { ErrorMessage, Formik } from "formik";
import { Box } from "@/components/ui/box";
import validationSchema from "@/schemas/login.schema";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { Input, LinearGradient } from "@/components";
import useSWR from "swr";
import { getUserLogged, login } from "@/services/auth.service";
import { useAuth } from "@/context/auth.context";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorWithStatus } from "@/utils/interfaces/error.interface";
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const { t } = useTranslation();
  const schema = validationSchema(t);
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const [showError, setShowError] = useState(false);

  const storeTokens = async (token: string, refreshToken: string) => {
    const tokenData = JSON.stringify({ token, refreshToken });

    setToken(tokenData);

    await AsyncStorage.setItem("auth_token", tokenData);
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setShowError(false);

    try {
      Keyboard.dismiss();
      const response = await login(values);

      await storeTokens(response.access_token, response.refresh_token);

      router.replace("/(tabs)");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "status" in err) {
        const errorWithStatus = err as ErrorWithStatus;
        if (errorWithStatus.status === 500) {
          router.replace({
            pathname: "/error",
            params: {
              title: "Ups! Hubo un problema al intentar iniciar sesión",
              subtitle: "Por favor, intenta nuevamente más tarde.",
              buttonText: "Ir al inicio",
              buttonAction: () => router.replace("/(auth)/sign-in"),
            },
          });
        } else if (errorWithStatus.status === 401) {
          console.log(err);
        }
      } else {
        console.error("Error inesperado:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient style={styles.wrapper}>
      <KeyboardContainer>
        <View style={styles.container}>
          <VStack space="lg" className="items-center mb-9">
            <Hop color={Colors.SECONDARY} />
            <Text className="text-2xl font-semibold mt-12">
              {t("signin.welcome", { ns: "auth" })}
            </Text>
            <Text>{t("signin.sign_in_to_your_account", { ns: "auth" })}</Text>
          </VStack>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={schema}
            onSubmit={handleLogin}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <VStack space="lg">
                  <Input
                    label={t("signin.email_label", { ns: "auth" })}
                    placeholder=""
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    touched={touched.email}
                    error={touched.email && errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <Box>
                    <Input
                      label={t("signin.password_label", { ns: "auth" })}
                      placeholder=""
                      secureTextEntry
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      touched={touched.password}
                      error={touched.password && errors.password}
                      rightIcon
                    />
                    <Text
                      className="text-[#2EC4B6] underline mt-2"
                      onPress={() =>
                        router.push(AuthRoutesLink.RECOVERY_PASSWORD)
                      }
                    >
                      {t("signin.forgot_password", { ns: "auth" })}
                    </Text>
                  </Box>
                </VStack>
                <VStack space="lg" className="mt-28">
                  <Button
                    variant="solid"
                    className="rounded-xl bg-[#2EC4B6] self-center"
                    onPress={() => handleSubmit()}
                  >
                    {!loading ? (
                      <ButtonText className="font-semibold text-lg">
                        {t("signin.sign_in_button", { ns: "auth" })}
                      </ButtonText>
                    ) : (
                      <ButtonSpinner
                        className={loading ? "min-w-44 " : ""}
                        color={Colors.WHITE}
                      />
                    )}
                  </Button>
                  <Text className="text-center text-[#10524B]">
                    {t("signin.no_account", { ns: "auth" })}{" "}
                    <Text
                      className="font-semibold"
                      onPress={() => {
                        router.navigate(AuthRoutesLink.SIGN_UP);
                      }}
                    >
                      {t("signin.create_account", { ns: "auth" })}
                    </Text>
                  </Text>
                </VStack>
              </>
            )}
          </Formik>
        </View>
      </KeyboardContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 24,
  },
  container: {
    paddingHorizontal: 16,
    flexGrow: 1,
    justifyContent: "center",
  },
});
