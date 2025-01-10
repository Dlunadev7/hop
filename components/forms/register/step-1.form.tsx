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
import { useTranslation } from "react-i18next";

type formProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
};

export default function Step1(props: formProps) {
  const { payload, setStep } = props;
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

  return (
    <View style={styles.formulary}>
      <Text className="text-lg">
        {t("signup.step_1.title", { ns: "auth" })}
      </Text>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          rut: "",
          address: "",
          birthDate: "",
        }}
        validationSchema={schema}
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
                label="Password"
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

              <Box className="mt-[24px] gap-3">
                <Button
                  variant="solid"
                  className="rounded-xl bg-[#2EC4B6] self-center"
                  onPress={() => handleSubmit()}
                >
                  <ButtonText className="font-semibold text-lg">
                    {t("signup.step_1.next", { ns: "auth" })}
                  </ButtonText>
                </Button>
                <Text className="text-center text-[#10524B]">
                  {t("signup.step_1.already_have_account", { ns: "auth" })}{" "}
                  <Text
                    className="font-semibold"
                    onPress={() => router.push(AuthRoutesLink.SIGN_IN)}
                  >
                    {t("signup.step_1.sign_in", { ns: "auth" })}
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
    flex: 1,
  },
});
