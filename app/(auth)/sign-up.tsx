import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { Step1, Step2, Step3, Step4 } from "@/components/forms/register";
import { LinearGradient } from "@/components";
import { userInfo } from "os";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState({
    email: "",
    password: "Csaomsiala7#",
    role: "USER_HOPPER",
    firstName: "",
    lastName: "",
    rut: "",
    phone: "",
    home_address: "",
    bank_name: "",
    bank_account: "",
    bank_account_type: "",
    bank_account_rut: "",
    bank_account_number: "",
    bank_account_holder: "",
  });

  const accumulatePayload = (newData: {}) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      ...newData,
    }));
  };

  const steps = [Step1, Step2, Step3, Step4];

  const renderStep = () => {
    const StepComponent = steps[step - 1] || Step1;
    const payloadCompleted = {
      email: payload.email,
      password: payload.password,
      role: "USER_HOPPER",
      userInfo: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        rut: payload.rut,
        phone: payload.phone,
        home_address: payload.home_address,
        bank_name: payload.bank_name,
        bank_account_holder: payload.bank_account_holder,
        bank_account_type: payload.bank_account_type,
        bank_account_rut: payload.bank_account_rut,
        bank_account: payload.bank_account,
      },
    };
    return (
      <StepComponent
        setStep={setStep}
        payload={accumulatePayload}
        payloadValues={payloadCompleted}
      />
    );
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
    position: "relative",
  },
  header: {
    marginBottom: 24,
  },
  formulary_container: {
    gap: 12,
  },
});
