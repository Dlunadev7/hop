import { StyleSheet, View } from "react-native";
import React from "react";
import { Formik } from "formik";
import { Text } from "@/components/ui/text";
import { validationSchemaS1 } from "@/schemas/register.schema";
import { VStack } from "@/components/ui/vstack";
import { Input } from "@/components/input/input.component";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { accountTypes } from "@/constants/account.constants";
import { Select } from "@/components/select/select.component";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { Colors } from "@/constants/Colors";
import { ArrowLeft } from "@/assets/svg";
import { StepControl } from "@/components/step-controls/step-control.component";
import { useTranslation } from "react-i18next";

type formProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
};

export default function Step2(props: formProps) {
  const { payload, setStep } = props;
  const { t } = useTranslation();
  const schema = validationSchemaS1(t);
  console.log(
    t("validations.step_2.bank_account_type.current_account", { ns: "auth" })
  );
  return (
    <View style={styles.formulary}>
      <Text className="text-lg mb-4">
        {t("signup.step_2.title", { ns: "auth" })}
      </Text>
      <Formik
        initialValues={{
          bank_account_holder: "",
          bank_name: "",
          bank_account_rut: "",
          bank_account_type: "",
          bank_account: "",
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          setStep(3);
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
        }) => {
          console.log(errors);
          return (
            <VStack space="md">
              <Input
                label={t("signup.step_2.fields.accountHolder.label", {
                  ns: "auth",
                })}
                onBlur={handleBlur("bank_account_holder")}
                onChangeText={handleChange("bank_account_holder")}
                placeholder=""
                value={values.bank_account_holder}
                error={
                  touched.bank_account_holder && errors.bank_account_holder
                }
                touched={touched.bank_account_holder}
              />
              <Input
                label={t("signup.step_2.fields.bankName.label", {
                  ns: "auth",
                })}
                onBlur={handleBlur("bank_name")}
                onChangeText={handleChange("bank_name")}
                placeholder=""
                value={values.bank_name}
                error={touched.bank_name && errors.bank_name}
                touched={touched.bank_name}
              />

              <Input
                label={t("signup.step_2.fields.accountNumber.label", {
                  ns: "auth",
                })}
                onBlur={handleBlur("bank_account")}
                onChangeText={handleChange("bank_account")}
                placeholder=""
                value={values.bank_account}
                error={touched.bank_account && errors.bank_account}
                touched={touched.bank_account}
                keyboardType="number-pad"
              />

              <Select
                label={t("signup.step_2.fields.accountType.label", {
                  ns: "auth",
                })}
                placeholder={t("signup.step_2.fields.accountType.placeholder", {
                  ns: "auth",
                })}
                onSelect={handleChange("bank_account_type")}
                options={accountTypes.map((type) => ({
                  label: t(
                    `validations.step_2.bank_account_type.${type.value}`
                  ),
                  value: type.value,
                }))}
                touched={touched.bank_account_type}
                error={touched.bank_account_type && errors.bank_account_type}
              />

              <Input
                label={t("signup.step_2.fields.rut.label", {
                  ns: "auth",
                })}
                onBlur={handleBlur("bank_account_rut")}
                onChangeText={handleChange("bank_account_rut")}
                placeholder=""
                value={values.bank_account_rut}
                error={touched.bank_account_rut && errors.bank_account_rut}
                touched={touched.bank_account_rut}
                keyboardType="number-pad"
              />
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
          );
        }}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  formulary: {
    gap: 16,
    flex: 1,
  },
});
