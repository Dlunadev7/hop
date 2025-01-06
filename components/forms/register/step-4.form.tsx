import { StyleSheet, View } from "react-native";
import React from "react";
import { Formik } from "formik";
import { Text } from "@/components/ui/text";
import { validationSchemaS3 } from "@/schemas/register.schema";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { CircleArrowRight } from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { StepControl } from "@/components/step-controls/step-control.component";

type formProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
};

export default function Step4(props: formProps) {
  const { payload, setStep } = props;

  return (
    <View style={styles.formulary}>
      <Text className="text-lg mb-4">Verifica tu Identidad</Text>
      <Formik
        initialValues={{}}
        onSubmit={() => {
          router.replace(AuthRoutesLink.FINISH_ONBOARDING);
          // Logica de envio de registro
          // payload(values);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <View
              className={`bg-[${Colors.PRIMARY}] h-11 w-72 rounded-2xl px-3 flex-row items-center gap-2 self-center justify-center`}
            >
              <Text
                className={`text-lg font-semibold text-[${Colors.DARK_GREEN}]`}
              >
                Ir al sitio
              </Text>
              <CircleArrowRight color={Colors.DARK_GREEN} />
            </View>

            <StepControl
              handleBack={() => setStep(3)}
              handleNext={handleSubmit}
              textBack="Atrás"
              textNext="Enviar formulario"
            />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  formulary: {
    gap: 16,
  },
});
