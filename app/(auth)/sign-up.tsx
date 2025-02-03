import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { Step1, Step2, Step3, Step4 } from "@/components/forms/register";
import { LinearGradient } from "@/components";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/text/text.component";
import { Colors } from "@/constants/Colors";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "@/context/auth.context";
import { userRoles } from "@/utils/enum/role.enum";
import Step3Hopper from "@/components/forms/register/step-3.hopper.form";
import Step4Hopper from "@/components/forms/register/step-4.hopper.form";
import { i18NextType } from "@/utils/types/i18n.type";
import { Fab, FabIcon } from "@/components/ui/fab";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeftRounded } from "@/assets/svg";

export default function SignUp() {
  const queryParams = useRoute().params as any;
  const { t } = useTranslation();
  const [step, setStep] = useState(
    queryParams.step ? Number(queryParams.step) : 1
  );
  const [id, setId] = useState("");
  const { state } = useAuth();
  const insets = useSafeAreaInsets();

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    role: "USER_HOPPER",
    firstName: "",
    lastName: "",
    rut: "",
    phone: "",
    user_address: {
      address: "",
      latitude: "",
      longitude: "",
    },
    bank_name: "",
    bank_account: "",
    bank_account_type: "",
    bank_account_rut: "",
    bank_account_number: "",
    bank_account_holder: "",
    hotel_address: {
      hotel_name: "",
      address: "",
      latitude: "",
      longitude: "",
    },
    birthdate: "",
  });

  const accumulatePayload = (newData: {}) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      ...newData,
    }));
  };

  const role =
    queryParams.user_type === "hoppy"
      ? userRoles.USER_HOPPY
      : userRoles.USER_HOPPER;

  const steps = [
    Step1,
    Step2,
    role === userRoles.USER_HOPPER ? Step3Hopper : Step3,
    role === userRoles.USER_HOPPER ? Step4Hopper : Step4,
    Step4,
  ];

  const renderStep = () => {
    const StepComponent = steps[step - 1] || Step1;
    const payloadCompleted = {
      email: payload.email,
      password: payload.password,
      role: role,
      userInfo: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        rut: payload.rut,
        phone: payload.phone,
        user_address: {
          address: state.user_info.address,
          latitude: state.user_info.latitude,
          longitude: state.user_info.longitude,
        },
        bank_name: payload.bank_name,
        bank_account_holder: payload.bank_account_holder,
        bank_account_type: payload.bank_account_type,
        bank_account_rut: payload.bank_account_rut,
        bank_account: payload.bank_account,
        birthdate: payload.birthdate,
        hotel_address: {
          name: payload.hotel_address.hotel_name,
          address: state.hotel_info.address,
          latitude: state.hotel_info.latitude,
          longitude: state.hotel_info.longitude,
        },
      },
    };
    return (
      <StepComponent
        setStep={setStep}
        payload={accumulatePayload}
        payloadValues={payloadCompleted}
        extraData={id}
        setId={setId}
        role={role}
      />
    );
  };

  const getStepMessage = (
    step: number,
    role: string,
    userRoles: any,
    t: i18NextType
  ) => {
    if (step === 4 && role === userRoles.USER_HOPPY) {
      return t("signup.step_message_final");
    }

    if (role === userRoles.USER_HOPPER && step === 3) {
      return t("signup.step_message_hopper");
    }

    if ((step === 4 && role === userRoles.USER_HOPPY) || step === 5) {
      return t("signup.step_message_final");
    }

    return t("signup.step_message");
  };

  const message = getStepMessage(step, role, userRoles, t);

  return (
    <LinearGradient locations={[0, 0.3]}>
      {!(step === 1) ? (
        <Fab
          placement="top left"
          onPress={() => setStep(step === 1 ? step : step - 1)}
          className="bg-[#E1F5F3] w-[24px] h-[24px]"
          style={{
            marginTop: insets.top,
          }}
        >
          <FabIcon as={ArrowLeftRounded} width={30} />
        </Fab>
      ) : (
        <></>
      )}
      <KeyboardContainer>
        <View style={styles.container}>
          <View style={styles.header}>
            <VStack space="xs" className="items-center mb-6">
              <Text
                fontSize={28}
                textColor={Colors.DARK_GREEN}
                fontWeight={600}
              >
                {queryParams.user_type === "hoppy"
                  ? t("signup.title", { ns: "auth" })
                  : t("signup.title_hopper", { ns: "auth" })}
              </Text>
              <Text
                fontSize={14}
                fontWeight={400}
                textColor={Colors.DARK_GREEN}
              >
                {queryParams.user_type === "hoppy"
                  ? t("signup.subtitle")
                  : t("signup.subtitle_hopper")}
              </Text>
            </VStack>
            <Text fontSize={14} fontWeight={400} textAlign="center">
              {message}
            </Text>
          </View>
          <View style={styles.formulary_container}>
            <Text fontWeight={600} fontSize={14}>
              {t("signup.step_label", { step })}
            </Text>
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
    marginVertical: "auto",
    position: "relative",
  },
  header: {
    marginBottom: 24,
  },
  formulary_container: {
    gap: 12,
  },
});
