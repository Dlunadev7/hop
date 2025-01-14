import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { Formik } from "formik";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import validationSchema from "@/schemas/send-code";
import { Input, LinearGradient } from "@/components";
import { recoveryPassword } from "@/services/auth.service";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button/button.component";
import { Text } from "@/components/text/text.component";
import { Colors } from "@/constants/Colors";
import useTimer from "@/hooks/useTimer.hook";

export default function RecoveryPassword() {
  const { t } = useTranslation();
  const schema = validationSchema(t);
  const { formattedTime, reset, start } = useTimer();

  const [loading, setLoading] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendEmail = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      await recoveryPassword(email);
      setIsCodeSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showTimer) {
      start();
    }
  }, [showTimer]);

  useEffect(() => {
    if (formattedTime === "00:00") {
      setShowTimer(false);
      reset();
    }
  }, [formattedTime]);

  return (
    <LinearGradient locations={[0, 0.3]}>
      <KeyboardContainer>
        <View style={styles.container}>
          <VStack space="lg" className="items-center mb-9">
            <Text fontSize={28} fontWeight={600} textColor={Colors.DARK_GREEN}>
              {t("forgot_password.title")}
            </Text>
            <Text fontSize={14} fontWeight={400} textAlign="center">
              {t("forgot_password.description")}
            </Text>
          </VStack>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={schema}
            onSubmit={(values) => {
              handleSendEmail(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldError,
              setTouched,
              values,
              errors,
              touched,
            }) => (
              <>
                <VStack space="lg">
                  <Input
                    label={t("forgot_password.emailLabel")}
                    placeholder=""
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    touched={touched.email}
                    error={touched.email && errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </VStack>
                <VStack space="lg" className="mt-28">
                  <Button
                    onPress={() => {
                      handleSubmit();
                    }}
                    loading={loading}
                  >
                    {t("forgot_password.sendCodeButton")}
                  </Button>
                  {isCodeSent && (
                    <Text textAlign="center">
                      {t("forgot_password.resendCodePrompt")}{" "}
                      <Text
                        fontWeight={600}
                        onPress={() => {
                          if (values.email.length < 1) {
                            setFieldError("email", "El email es requerido");
                            setTouched({ ...touched, email: true });
                            return;
                          }
                          if (!showTimer) {
                            handleSendEmail(values);
                            setShowTimer(true);
                            return;
                          }
                        }}
                      >
                        {showTimer
                          ? formattedTime
                          : t("forgot_password.resendCodeAction")}
                      </Text>
                    </Text>
                  )}
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
