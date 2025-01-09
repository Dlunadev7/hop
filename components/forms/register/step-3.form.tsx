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
          <>
            <VStack space="md">
              <Input
                label="Nombre del Hotel"
                onBlur={handleBlur("bank_name")}
                onChangeText={handleChange("bank_name")}
                placeholder=""
                value={values.bank_name}
                error={touched.bank_name && errors.bank_name}
                touched={touched.bank_name}
              />

              <Input
                label="Dirección"
                onBlur={handleBlur("home_address")}
                onChangeText={handleChange("home_address")}
                placeholder=""
                value={values.home_address}
                error={touched.home_address && errors.home_address}
                touched={touched.home_address}
              />
            </VStack>

            <StepControl
              handleBack={() => setStep(2)}
              handleNext={handleSubmit}
              textBack="Atrás"
              textNext="Siguiente"
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
    flex: 1,
    marginBottom: 120,
  },
});
