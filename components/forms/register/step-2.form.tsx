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
          accountHolder: "",
          bankName: "",
          accountNumber: "",
          accountType: "",
          rut: "",
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
          console.log(errors);
          return (
            <VStack space="md">
              <Input
                label="Titular de la cuenta"
                onBlur={handleBlur("accountHolder")}
                onChangeText={handleChange("accountHolder")}
                placeholder=""
                value={values.accountHolder}
                error={touched.accountHolder && errors.accountHolder}
                touched={touched.accountHolder}
              />
              <Input
                label="Nombre del Banco"
                onBlur={handleBlur("bankName")}
                onChangeText={handleChange("bankName")}
                placeholder=""
                value={values.bankName}
                error={touched.bankName && errors.bankName}
                touched={touched.bankName}
              />

              <Input
                label="Número de la cuenta"
                onBlur={handleBlur("accountNumber")}
                onChangeText={handleChange("accountNumber")}
                placeholder=""
                value={values.accountNumber}
                error={touched.accountNumber && errors.accountNumber}
                touched={touched.accountNumber}
                keyboardType="number-pad"
              />

              <Select
                label="Tipo de cuenta"
                onSelect={handleChange("accountType")}
                options={accountTypes}
                touched={touched.accountType}
                error={touched.accountType && errors.accountType}
              />

              <Input
                label="RUT del titular  "
                onBlur={handleBlur("rut")}
                onChangeText={handleChange("rut")}
                placeholder=""
                value={values.rut}
                error={touched.rut && errors.rut}
                touched={touched.rut}
                keyboardType="number-pad"
              />
              <StepControl
                handleBack={() => setStep(1)}
                handleNext={handleSubmit}
                textBack="Atrás"
                textNext="Siguiente"
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
  },
});
