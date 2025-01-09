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

type formProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
};

export default function Step2(props: formProps) {
  const { payload, setStep } = props;

  return (
    <View style={styles.formulary}>
      <Text className="text-lg mb-4">Cuenta Bancaria</Text>
      <Formik
        initialValues={{
          bank_account_holder: "",
          bank_name: "",
          bank_account_rut: "",
          bank_account_type: "",
          bank_account: "",
        }}
        validationSchema={validationSchemaS1}
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
          return (
            <VStack space="md" className="pb-4">
              <Input
                label="Titular de la cuenta"
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
                label="Nombre del Banco"
                onBlur={handleBlur("bank_name")}
                onChangeText={handleChange("bank_name")}
                placeholder=""
                value={values.bank_name}
                error={touched.bank_name && errors.bank_name}
                touched={touched.bank_name}
              />

              <Input
                label="Número de la cuenta"
                onBlur={handleBlur("bank_account")}
                onChangeText={handleChange("bank_account")}
                placeholder=""
                value={values.bank_account}
                error={touched.bank_account && errors.bank_account}
                touched={touched.bank_account}
                keyboardType="number-pad"
              />

              <Select
                label="Tipo de cuenta"
                onSelect={handleChange("bank_account_type")}
                options={accountTypes}
                touched={touched.bank_account_type}
                error={touched.bank_account_type && errors.bank_account_type}
              />

              <Input
                label="RUT del titular  "
                onBlur={handleBlur("bank_account_rut")}
                onChangeText={handleChange("bank_account_rut")}
                placeholder=""
                value={values.bank_account_rut}
                error={touched.bank_account_rut && errors.bank_account_rut}
                touched={touched.bank_account_rut}
                keyboardType="number-pad"
              />
              <View className="mt-[32px]">
                <StepControl
                  handleBack={() => setStep(1)}
                  handleNext={handleSubmit}
                  textBack="Atrás"
                  textNext="Siguiente"
                />
              </View>
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
