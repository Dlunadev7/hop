import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Formik, FormikErrors } from "formik";
import { validationSchema } from "@/schemas/register.schema";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Input from "@/components/input/input.component";
import { CalendarDaysIcon } from "@/components/ui/icon";
import { Calendar } from "@/components/calendar/calendar.component";
import { dateToString, stringToDate } from "@/helpers/date";
import { router } from "expo-router";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button/button.component";
import { Text } from "@/components/text/text.component";
import { Colors } from "@/constants/Colors";
import { RegisterType } from "@/utils/types/register.type";

type formProps = {
  payloadValues: RegisterType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
};

export default function Step1(props: formProps) {
  const { payload, setStep, payloadValues } = props;
  const [openCalendar, setOpenCalendar] = useState(false);
  const { t } = useTranslation();

  const schema = validationSchema(t);

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

  console.log(payloadValues);

  return (
    <View style={styles.formulary} className="pb-4">
      <Text fontSize={16} fontWeight={400}>
        {t("signup.step_1.title", { ns: "auth" })}
      </Text>
      <Formik
        initialValues={{
          firstName: payloadValues.userInfo.firstName,
          lastName: payloadValues.userInfo.lastName,
          email: payloadValues.email,
          password: payloadValues.password,
          rut: payloadValues.userInfo.rut,
          address: payloadValues.userInfo.home_address,
          birthDate: payloadValues.userInfo.birthdate,
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          setStep(2);
          payload({ home_address: values.address, ...values });
        }}
        enableReinitialize
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
          return (
            <VStack space="md">
              <HStack space="md">
                <Input
                  label={t("signup.step_1.name.label", { ns: "auth" })}
                  onBlur={handleBlur("firstName")}
                  onChangeText={handleChange("firstName")}
                  placeholder=""
                  value={values.firstName}
                  error={touched.firstName && errors.firstName}
                  touched={touched.firstName}
                  stretch
                />
                <Input
                  label={t("signup.step_1.last_name.label", { ns: "auth" })}
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
                label={t("signup.step_1.email.label", { ns: "auth" })}
                onBlur={handleBlur("email")}
                onChangeText={handleChange("email")}
                placeholder=""
                value={values.email}
                error={touched.email && errors.email}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label={t("signup.step_1.password.label", { ns: "auth" })}
                placeholder=""
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                touched={touched.password}
                error={touched.password && errors.password}
                rightIcon
              />

              {/* RUT */}
              <Input
                label={t("signup.step_1.rut.label", { ns: "auth" })}
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
                label={t("signup.step_1.address.label", { ns: "auth" })}
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
                label={t("signup.step_1.birth_date.label", { ns: "auth" })}
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

              <VStack className="mt-[24px] gap-5 w-full items-center">
                <Button
                  style={{ alignSelf: "center" }}
                  onPress={() => handleSubmit()}
                >
                  {t("signup.step_1.next", { ns: "auth" })}
                </Button>
                <Text fontSize={14} fontWeight={300} textColor={Colors.BLACK}>
                  {t("signup.step_1.already_have_account", { ns: "auth" })}{" "}
                  <Text
                    fontSize={14}
                    fontWeight={600}
                    onPress={() => router.push(AuthRoutesLink.SIGN_IN)}
                  >
                    {t("signup.step_1.sign_in", { ns: "auth" })}
                  </Text>
                </Text>
              </VStack>
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
