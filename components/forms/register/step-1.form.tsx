import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Formik, FormikErrors } from "formik";
import { Text } from "@/components/ui/text";
import { validationSchema } from "@/schemas/register.schema";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Input from "@/components/input/input.component";
import { CalendarDaysIcon } from "@/components/ui/icon";
import { Calendar } from "@/components/calendar/calendar.component";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { dateToString, stringToDate } from "@/helpers/date";
import dayjs from "dayjs";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";

type formProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
};

export default function Step1(props: formProps) {
  const { payload, setStep } = props;
  const [openCalendar, setOpenCalendar] = useState(false);

  const handleDateChange = (
    selectedDate: Date,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<unknown>>
  ) => {
    const formattedDate = dateToString(selectedDate);

    const currentValue = dateToString(new Date());

    if (formattedDate !== currentValue) {
      setFieldValue("birthDate", formattedDate);
      setOpenCalendar(false);
    }
  };

  return (
    <View style={styles.formulary}>
      <Text className="text-lg">Informacion personal</Text>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          rut: "",
          address: "",
          birthDate: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setStep(2);
          payload(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => {
          console.log(values.birthDate);
          console.log(dayjs("25/12/2025", "DD/MM/YYYY"));

          return (
            <VStack space="md">
              <HStack space="md">
                <Input
                  label="Nombre"
                  onBlur={handleBlur("firstName")}
                  onChangeText={handleChange("firstName")}
                  placeholder=""
                  value={values.firstName}
                  error={touched.firstName && errors.firstName}
                  touched={touched.firstName}
                  stretch
                />
                <Input
                  label="Apellido"
                  onBlur={handleBlur("lastName")}
                  onChangeText={handleChange("lastName")}
                  placeholder=""
                  value={values.lastName}
                  error={touched.lastName && errors.lastName}
                  touched={touched.lastName}
                  stretch
                />
              </HStack>

              <Input
                label="Correo electrónico"
                onBlur={handleBlur("email")}
                onChangeText={handleChange("email")}
                placeholder=""
                value={values.email}
                error={touched.email && errors.email}
                touched={touched.email}
                keyboardType="email-address"
              />

              {/* RUT */}
              <Input
                label="RUT"
                onBlur={handleBlur("rut")}
                onChangeText={handleChange("rut")}
                placeholder=""
                value={values.rut}
                error={touched.rut && errors.rut}
                touched={touched.rut}
                stretch
                keyboardType="number-pad"
              />

              {/* Address */}
              <Input
                label="Direccion"
                onBlur={handleBlur("address")}
                onChangeText={handleChange("address")}
                placeholder=""
                value={values.address}
                error={touched.address && errors.address}
                touched={touched.address}
                stretch
              />

              {/* Birth Date */}

              <Input
                label="Fecha de Nacimiento"
                onBlur={handleBlur("birthDate")}
                onChangeText={handleChange("birthDate")}
                placeholder="DD/MM/YYYY"
                value={values.birthDate}
                error={touched.birthDate && errors.birthDate}
                touched={touched.birthDate}
                rightIcon
                icon={CalendarDaysIcon}
                pressable
                isDisabled={true}
                onPress={() => setOpenCalendar(true)}
              />

              <Calendar
                date={
                  values.birthDate ? stringToDate(values.birthDate) : new Date()
                }
                isVisible={openCalendar}
                onClose={() => setOpenCalendar(false)}
                onDateChange={(date) => handleDateChange(date, setFieldValue)}
              />

              <Box className="mt-[24px] gap-3">
                <Button
                  variant="solid"
                  className="rounded-xl bg-[#2EC4B6] self-center"
                  onPress={() => handleSubmit()}
                >
                  <ButtonText className="font-semibold text-lg">
                    Siguiente
                  </ButtonText>
                </Button>
                <Text className="text-center text-[#10524B]">
                  ¿Ya tienes una cuenta?{" "}
                  <Text
                    className="font-semibold"
                    onPress={() => router.push(AuthRoutesLink.SIGN_IN)}
                  >
                    Iniciar Sesión
                  </Text>
                </Text>
              </Box>
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
