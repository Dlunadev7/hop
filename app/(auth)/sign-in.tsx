import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Hop } from "@/assets/svg";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { Formik } from "formik";
import { Box } from "@/components/ui/box";
import validationSchema from "@/schemas/login.schema";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { Input, LinearGradient } from "@/components";
import { login } from "@/services/auth.service";
import { useAuth } from "@/context/auth.context";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorWithStatus } from "@/utils/interfaces/error.interface";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/text/text.component";
import { Button } from "@/components/button/button.component";
import { useToast } from "@/hooks/use-toast";

export default function SignIn() {
  const { t } = useTranslation();
  const schema = validationSchema(t);
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const { showToast, toastId } = useToast();
  const storeTokens = async (token: string, refreshToken: string) => {
    const tokenData = JSON.stringify({ token, refreshToken });

    setToken(tokenData);

    await AsyncStorage.setItem("auth_token", tokenData);
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);

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
              // @ts-ignore
              buttonAction: () => router.replace("/(auth)/sign-in"),
            },
          });
        } else if (
          errorWithStatus.status === 401 ||
          errorWithStatus.status === 404
        ) {
          showToast({
            message: t("signin.login_error", { ns: "auth" }),
            action: "error",
            duration: 3000,
            placement: "bottom",
          });
        }
      } else {
        console.error("Error inesperado:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient locations={[0, 0.3]} style={styles.wrapper}>
      <KeyboardContainer>
        <View style={styles.container}>
          <VStack space="lg" className="items-center mb-9 w-[100%]">
            <Hop color={Colors.PRIMARY} />
            <Text
              fontSize={28}
              fontWeight={600}
              textColor={Colors.DARK_GREEN}
              className="text-2xl font-semibold mt-12"
            >
              {t("signin.welcome", { ns: "auth" })}
            </Text>
            <Text fontSize={16} fontWeight={400} textAlign="center">
              {t("signin.sign_in_to_your_account", { ns: "auth" })}
            </Text>
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
                    isRequired
                  />

                  <Box className="gap-[8px]">
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
                      isRequired
                    />
                    <Text
                      textColor={Colors.SECONDARY}
                      underline
                      fontSize={14}
                      onPress={() =>
                        router.push(AuthRoutesLink.RECOVERY_PASSWORD)
                      }
                    >
                      {t("signin.forgot_password", { ns: "auth" })}
                    </Text>
                  </Box>
                </VStack>
                <VStack className="mt-28 gap-[20px]">
                  <Button onPress={() => handleSubmit()} loading={loading}>
                    {t("signin.sign_in_button", { ns: "auth" })}
                  </Button>
                  <Text fontSize={14} fontWeight={300} textAlign="center">
                    {t("signin.no_account", { ns: "auth" })}{" "}
                    <Text
                      fontWeight={600}
                      onPress={() => {
                        router.navigate(AuthRoutesLink.ONBOARDING);
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
