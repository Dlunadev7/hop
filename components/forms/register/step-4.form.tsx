import { View, StyleSheet, Pressable } from "react-native";

import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { StepControl } from "@/components/step-controls/step-control.component";
import WebView from "react-native-webview";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { CircleArrowRight } from "@/assets/svg";
import useWebViewMessageHandler from "@/hooks/useWebViewMessageHandler";
import useInjectJavaScript from "@/hooks/useInjectJavascript";
import { METAMAP_API_KEY, METAMAP_API_URL, METAMAP_FLOW_ID } from "@/config";
import useSWR from "swr";
import { createUser, login } from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore

type formProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
  payloadValues: {};
};

export default function Step4(props: formProps) {
  const { data, error, mutate } = useSWR("signup", async () => null, {
    revalidateOnFocus: false,
  });
  const [loading, setLoading] = useState(false);
  const { setStep, payloadValues } = props;
  const { isDone, handleWebViewMessage } = useWebViewMessageHandler();
  const injectJavaScript = useInjectJavaScript();
  const webViewRef = useRef(null);
  const [openAccordion, setOpenAccordion] = useState(false);

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
    <View style={styles.formulary}>
      <Text className="text-lg mb-4">Verifica tu Identidad</Text>
      <Formik
        initialValues={{}}
        onSubmit={() => {
          handleSignUp(payloadValues);
          console.log(payloadValues);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <Pressable
              style={{ backgroundColor: Colors.PRIMARY }}
              className={`p-2 h-11 w-72 rounded-2xl px-3 flex-row items-center gap-2 self-center justify-center hover:none`}
              onPress={() => setOpenAccordion(true)}
            >
              <Text
                className={`text-lg font-semibold text-[${Colors.DARK_GREEN}] hover:none`}
              >
                Ir al sitio
              </Text>
              <CircleArrowRight color={Colors.DARK_GREEN} />
            </Pressable>
            {openAccordion && (
              <Actionsheet
                isOpen={openAccordion}
                snapPoints={[90]}
                closeOnOverlayClick
                useRNModal
                onClose={() => setOpenAccordion(false)}
              >
                <ActionsheetBackdrop />
                <ActionsheetContent style={{ height: 500 }}>
                  <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                  </ActionsheetDragIndicatorWrapper>
                  <ActionsheetItem className="flex-1 w-[100%]" disabled>
                    <VStack className="flex-1">
                      <WebView
                        source={{
                          uri: `${METAMAP_API_URL}/?merchantToken=${METAMAP_API_KEY}&flowId=${METAMAP_FLOW_ID}`,
                        }}
                        javaScriptEnabled
                        domStorageEnabled
                        allowsInlineMediaPlayback
                        mediaPlaybackRequiresUserAction={false}
                        originWhitelist={["*"]}
                        className="flex-1"
                        injectedJavaScript={injectJavaScript()}
                        onMessage={handleWebViewMessage}
                        onLoadEnd={() => {
                          if (webViewRef.current) {
                            // @ts-ignore
                            webViewRef.current.injectJavaScript(
                              injectJavaScript()
                            );
                          }
                        }}
                        ref={webViewRef}
                      />
                      {isDone && (
                        <Button
                          variant="solid"
                          className="rounded-xl bg-[#2EC4B6] self-center"
                          onPress={() => setOpenAccordion(false)}
                        >
                          <ButtonText className="font-semibold text-lg">
                            Finalizar
                          </ButtonText>
                        </Button>
                      )}
                    </VStack>
                  </ActionsheetItem>
                </ActionsheetContent>
              </Actionsheet>
            )}
            {isDone && (
              <StepControl
                handleBack={() => setStep(3)}
                handleNext={handleSubmit}
                textBack="Atrás"
                textNext="Enviar formulario"
                loading={loading}
              />
            )}
          </>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({
  formulary: {
    flex: 1,
    gap: 16,
  },
});
