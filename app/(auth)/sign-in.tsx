import { StyleSheet, View } from "react-native";
import React from "react";
import { Hop } from "@/assets/svg";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { Formik } from "formik";
import { Box } from "@/components/ui/box";
import validationSchema from "@/schemas/login.schema";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { Input, LinearGradient } from "@/components";

export default function SignIn() {
  return (
    <LinearGradient style={styles.wrapper}>
      <KeyboardContainer>
        <View style={styles.container}>
          <VStack space="lg" className="items-center mb-9">
            <Hop />
            <Text className="text-2xl font-semibold mt-12">Bienvenido</Text>
            <Text>Inicia sesión en tu cuenta</Text>
          </VStack>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("values", values);
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
                    label="Email"
                    placeholder=""
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    touched={touched.email}
                    error={touched.email && errors.email}
                    keyboardType="email-address"
                  />

                  <Box>
                    <Input
                      label="Password"
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
                      Olvide mi contraseña
                    </Text>
                  </Box>
                </VStack>
                <VStack space="lg" className="mt-28">
                  <Button
                    variant="solid"
                    className="rounded-xl bg-[#2EC4B6] self-center"
                    onPress={() => handleSubmit()}
                  >
                    <ButtonText className="font-semibold text-lg">
                      Iniciar Sesión
                    </ButtonText>
                  </Button>
                  <Text className="text-center text-[#10524B]">
                    ¿Aún no tienes una cuenta?{" "}
                    <Text
                      className="font-semibold"
                      onPress={() => {
                        router.navigate(AuthRoutesLink.SIGN_UP);
                      }}
                    >
                      Crea una
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
