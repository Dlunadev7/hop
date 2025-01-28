import { View, StyleSheet, Pressable, Linking, Platform } from "react-native";

import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { Text } from "@/components/ui/text";
import WebView from "react-native-webview";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
} from "@/components/ui/actionsheet";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { CircleArrowRight } from "@/assets/svg";
import useWebViewMessageHandler from "@/hooks/useWebViewMessageHandler";
import useInjectJavaScript from "@/hooks/useInjectJavascript";
import { METAMAP_API_KEY, METAMAP_API_URL, METAMAP_FLOW_ID } from "@/config";
import { useTranslation } from "react-i18next";
// @ts-ignore
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Button } from "@/components/button/button.component";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
type formProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
  payloadValues: {};
  role: string;
};

export default function Step4(props: formProps) {
  const requestPermissions = async () => {
    await Camera.requestCameraPermissionsAsync();
    await MediaLibrary.requestPermissionsAsync();
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const { t } = useTranslation();

  const { isDone, handleWebViewMessage } = useWebViewMessageHandler();
  const injectJavaScript = useInjectJavaScript();

  const [openAccordion, setOpenAccordion] = useState(false);
  const webViewRef = useRef(null);

  return (
    <View style={styles.formulary} className="pb-4">
      <Text className="text-lg mb-4">{t("signup.step_4.title")}</Text>
      <Formik initialValues={{}} onSubmit={() => {}}>
        {({ handleSubmit }) => (
          <VStack
            space="lg"
            className={`justify-between ${
              Platform.OS === "ios" ? "h-[80%]" : "h-[82%]"
            }`}
          >
            <Pressable
              style={{ backgroundColor: Colors.PRIMARY }}
              className={`p-2 h-11 w-72 rounded-2xl px-3 flex-row items-center gap-2 self-center justify-center hover:none`}
              onPress={() => {
                setOpenAccordion(true);
              }}
            >
              <Text
                className={`text-lg font-semibold text-[${Colors.DARK_GREEN}] hover:none`}
              >
                {t("signup.step_4.go_site")}{" "}
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
                          uri: `${METAMAP_API_URL}?merchantToken=${METAMAP_API_KEY}&flowId=${METAMAP_FLOW_ID}`,
                        }}
                        javaScriptEnabled
                        domStorageEnabled
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
                        mediaPlaybackRequiresUserAction={false}
                        ref={webViewRef}
                        allowsInlineMediaPlayback={true}
                        allowsFullscreenVideo={true}
                      />
                      {isDone && (
                        <Button onPress={() => setOpenAccordion(false)}>
                          Finalizar
                        </Button>
                      )}
                    </VStack>
                  </ActionsheetItem>
                </ActionsheetContent>
              </Actionsheet>
            )}
            {isDone ? (
              <Button
                onPress={() => router.replace(AuthRoutesLink.FINISH_ONBOARDING)}
              >
                {t("signup.step_4.register")}{" "}
              </Button>
            ) : (
              <Button
                onPress={() => router.replace(AuthRoutesLink.FINISH_ONBOARDING)}
              >
                {t("signup.step_4.register")}{" "}
              </Button>
            )}
          </VStack>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({
  formulary: {
    gap: 16,
    paddingBottom: Platform.OS === "ios" ? 120 : 0,
  },
});
