import { StyleSheet, View } from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Formik } from "formik";
import { Box } from "@/components/ui/box";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import validationSchema from "@/schemas/new-password";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { Input, LinearGradient } from "@/components";
import { Text } from "@/components/text/text.component";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button/button.component";
import { getUserLogged, updateUser } from "@/services/auth.service";
import useSWR from "swr";
import { updateUserData } from "@/services/user.service";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/auth.context";
import { useDrawer } from "@/context/drawer.context";

export default function NewPassword() {
  const { t } = useTranslation();
  const { clearToken } = useAuth();
  const { data } = useSWR("/user/logged", getUserLogged);
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();

  const schema = validationSchema(t);

  const handleResetPassword = async (values: { password: string }) => {
    router.dismissAll();
    await updateUserData(data?.id!, {
      password: values.password!,
      email: data?.email!,
    });
    clearToken();
    setIsDrawerOpen(false);
  };

  return (
    <LinearGradient>
      <KeyboardContainer>
        <View style={styles.container}>
          <VStack space="lg" className="items-center mb-9">
            <Text
              fontSize={28}
              fontWeight={600}
              textAlign="center"
              textColor={Colors.DARK_GREEN}
            >
              {t("new_password.create_new_password", { ns: "auth" })}
            </Text>
            <Text fontSize={16} fontWeight={400} textAlign="center">
              {t("new_password.fill_fields_to_change_password", { ns: "auth" })}
            </Text>
          </VStack>
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={schema}
            onSubmit={(values) => {
              handleResetPassword(values);
              router.replace(AuthRoutesLink.FINISH_RECOVER_PASSWORD);
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
                  <Box>
                    <Input
                      label={t("new_password.new_password_label")}
                      placeholder=""
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      touched={touched.password}
                      error={touched.password && errors.password}
                      secureTextEntry
                      rightIcon
                    />
                  </Box>

                  <Input
                    label={t("new_password.confirm_password_label")}
                    placeholder=""
                    secureTextEntry
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    touched={touched.confirmPassword}
                    error={touched.confirmPassword && errors.confirmPassword}
                    rightIcon
                  />
                </VStack>
                <VStack space="lg" className="mt-28">
                  <Button onPress={() => handleSubmit()}>
                    {t("new_password.change_password_button", { ns: "auth" })}
                  </Button>
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
