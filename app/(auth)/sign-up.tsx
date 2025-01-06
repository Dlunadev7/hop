import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { Step1, Step2, Step3, Step4 } from "@/components/forms/register";
import { LinearGradient } from "@/components";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState({});

  const accumulatePayload = (newData: {}) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      ...newData,
    }));
  };

  const steps = [Step1, Step2, Step3, Step4];

  const renderStep = () => {
    const StepComponent = steps[step - 1] || Step1;
    return <StepComponent setStep={setStep} payload={accumulatePayload} />;
  };

  return (
    <LinearGradient>
      <KeyboardContainer>
        <View style={styles.container}>
          <View style={styles.header}>
            <VStack space="xs">
              <Text className="text-2xl text-center font-semibold">
                Registro de Hoppy
              </Text>
              <Text className="text-center">(recepcionista)</Text>
            </VStack>
            <Text className="text-center mt-[16px]">
              {step === 4
                ? "Sigue el link para confirmar tu identidad y finalizarla solicitud de registro"
                : "Para solicitar el registro debes completar los campos siguientes"}
            </Text>
          </View>
          <View style={styles.formulary_container}>
            <Text className="font-bold text-sm">Paso {step} de 4</Text>
            {renderStep()}
          </View>
        </View>
      </KeyboardContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 16,
    margin: "auto",
  },
  header: {
    marginBottom: 24,
  },
  formulary_container: {
    gap: 12,
  },
});
