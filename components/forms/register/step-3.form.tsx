import { StyleSheet, View } from "react-native";
import React from "react";
import { Formik } from "formik";
import { Text } from "@/components/ui/text";
import { validationSchemaS3 } from "@/schemas/register.schema";
import { VStack } from "@/components/ui/vstack";
import Input from "@/components/input/input.component";
import { StepControl } from "@/components/step-controls/step-control.component";
import { useTranslation } from "react-i18next";
import { Box } from "@/components/ui/box";

type formProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
};

export default function Step3(props: formProps) {
  const { payload, setStep } = props;
  const { t } = useTranslation();
  return (
    <View style={styles.formulary}>
      <Text className="text-lg mb-4">{t("signup.step_3.title")}</Text>
      <Formik
        initialValues={{
          bank_name: "",
          home_address: "",
        }}
        validationSchema={validationSchemaS3}
        onSubmit={(values) => {
          setStep(4);
          payload(values);
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
          <VStack space="lg" className="justify-between h-[80%]">
            <Box className="gap-4">
              <Input
                label={t("signup.step_3.hotel_name.label")}
                onBlur={handleBlur("bank_name")}
                onChangeText={handleChange("bank_name")}
                placeholder=""
                value={values.bank_name}
                error={touched.bank_name && errors.bank_name}
                touched={touched.bank_name}
              />

              <Input
                label={t("signup.step_3.address.label")}
                onBlur={handleBlur("home_address")}
                onChangeText={handleChange("home_address")}
                placeholder=""
                value={values.home_address}
                error={touched.home_address && errors.home_address}
                touched={touched.home_address}
              />
            </Box>

            <StepControl
              handleBack={() => setStep(1)}
              handleNext={handleSubmit}
              textBack={t("signup.step_2.buttons.back", {
                ns: "auth",
              })}
              textNext={t("signup.step_2.buttons.next", {
                ns: "auth",
              })}
            />
          </VStack>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  formulary: {
    gap: 16,
    paddingBottom: 120,
  },
});
