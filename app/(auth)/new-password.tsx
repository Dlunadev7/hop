import { StyleSheet, View } from "react-native";
import React from "react";
import { Hop } from "@/assets/svg";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { VStack } from "@/components/ui/vstack";
import { Formik } from "formik";
import { Box } from "@/components/ui/box";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import validationSchema from "@/schemas/new-password";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { Input, LinearGradient } from "@/components";

export default function NewPassword() {
  return (
    <LinearGradient>
      <KeyboardContainer>
        <View style={styles.container}>
          <VStack space="lg" className="items-center mb-9">
            <Hop color={Colors.PRIMARY} />
            <Text className="text-2xl font-semibold mt-12">
              Crea una nueva contraseña
            </Text>
            <Text className="text-center">
              Completa los siguientes campos para cambiar tu contraseña
            </Text>
          </VStack>
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
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
                      label="Crea una nueva contraseña"
                      placeholder=""
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      touched={touched.password}
                      error={touched.password && errors.password}
                      secureTextEntry
                      rightIcon
                    />
                    <Text className={`text-xs font-light text-[#8E8E8E] mt-2`}>
                      * Este campo debe contener entre 8 y 20 caracteres{"\n"}
                      {"  "}
                      alfanuméricos.
                    </Text>
                  </Box>

                  <Input
                    label="Confirmar contraseña"
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
                  <Button
                    variant="solid"
                    className="rounded-xl bg-[#2EC4B6] self-center"
                    onPress={() => {
                      handleSubmit();
                    }}
                  >
                    <ButtonText className="font-semibold text-lg">
                      Cambiar contraseña
                    </ButtonText>
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
