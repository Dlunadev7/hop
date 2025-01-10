import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Hop } from "@/assets/svg";
import { Text } from "@/components/ui/text";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Formik } from "formik";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import validationSchema from "@/schemas/send-code";
import { Input, LinearGradient } from "@/components";
import { recoveryPassword } from "@/services/auth.service";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

export default function RecoveryPassword() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const schema = validationSchema(t);
  const handleSendEmail = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      await recoveryPassword(email);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient>
      <KeyboardContainer>
        <View style={styles.container}>
          <VStack space="lg" className="items-center mb-9">
            <Hop color={Colors.PRIMARY} />
            <Text className="text-2xl font-semibold mt-12">
              {t("forgot_password.title")}
            </Text>
            <Text className="text-center">
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
                    variant="solid"
                    className="rounded-xl bg-[#2EC4B6] self-center"
                    onPress={() => {
                      handleSubmit();
                    }}
                  >
                    {loading ? (
                      <ButtonSpinner color={Colors.WHITE} />
                    ) : (
                      <ButtonText className="font-semibold text-lg">
                        {t("forgot_password.sendCodeButton")}
                      </ButtonText>
                    )}
                  </Button>
                  <Text className="text-center text-[#10524B]">
                    {t("forgot_password.resendCodePrompt")}{" "}
                    <Text
                      className="font-semibold"
                      onPress={() => {
                        handleSendEmail(values);
                      }}
                    >
                      {t("forgot_password.resendCodeAction")}
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
