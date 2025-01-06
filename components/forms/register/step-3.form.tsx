import { StyleSheet, View } from "react-native";
import React from "react";
import { Formik } from "formik";
import { Text } from "@/components/ui/text";
import { validationSchemaS3 } from "@/schemas/register.schema";
import { VStack } from "@/components/ui/vstack";
import Input from "@/components/input/input.component";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { StepControl } from "@/components/step-controls/step-control.component";

type formProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
};

export default function Step3(props: formProps) {
  const { payload, setStep } = props;

  return (
    <View style={styles.formulary}>
      <Text className="text-lg mb-4">Información del Hotel</Text>
      <Formik
        initialValues={{
          bankName: "",
          address: "",
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
          <VStack space="lg">
            <Input
              label="Nombre del Hotel"
              onBlur={handleBlur("bankName")}
              onChangeText={handleChange("bankName")}
              placeholder=""
              value={values.bankName}
              error={touched.bankName && errors.bankName}
              touched={touched.bankName}
            />

            <Input
              label="Dirección"
              onBlur={handleBlur("address")}
              onChangeText={handleChange("address")}
              placeholder=""
              value={values.address}
              error={touched.address && errors.address}
              touched={touched.address}
            />

            <StepControl
              handleBack={() => setStep(2)}
              handleNext={handleSubmit}
              textBack="Atrás"
              textNext="Siguiente"
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
  },
});
