import { Pressable, Keyboard } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Text } from "../text/text.component";
import { useTranslation } from "react-i18next";
import { VStack } from "../ui/vstack";
import Input from "../input/input.component";
import { Select } from "../select/select.component";
import { Button } from "../button/button.component";
import { passengerOptions } from "@/helpers/passengers";
import { luggageOptions } from "@/helpers/luggage";
import { Formik } from "formik";
import { ScrollView } from "react-native-gesture-handler";
import { BookingData } from "@/utils/interfaces/booking.interface";
import { validationSchema } from "@/schemas/booking.schema";
import { PhoneNumber } from "../phone-number/phone-number.component";

export const Step2Booking = (props: {
  setStepper: React.Dispatch<React.SetStateAction<number>>;
  updateBookingData: any;
  data: BookingData;
}) => {
  const { setStepper, updateBookingData, data } = props;
  const { t } = useTranslation();

  const schema = validationSchema(t);

  console.log(data);

  return (
    <Pressable
      style={{
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 16,
      }}
      onPress={() => Keyboard.dismiss()}
    >
      <Text fontSize={24} fontWeight={400}>
        {t("home.map_home.second_sheet.title", { ns: "home" })}
      </Text>

      <Formik
        initialValues={{
          fullName: data?.fullName || "",
          contact: data?.contact || "",
          roomNumber: data?.roomNumber || "",
          numberOfPassengers: data?.numberOfPassengers || 1,
          numberOfLuggages: data?.numberOfLuggages || 0,
          countryCode: data.countryCode || "",
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          updateBookingData((prevState: BookingData) => ({
            ...prevState,
            ...values,
          }));
          setStepper(3);
        }}
      >
        {({
          setFieldValue,
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => {
          return (
            <ScrollView>
              <VStack space="md" className="mt-6 mb-6">
                <Input
                  label={t("home.map_home.second_sheet.fields.name.label", {
                    ns: "home",
                  })}
                  onBlur={handleBlur("fullName")}
                  onChangeText={handleChange("fullName")}
                  value={values.fullName}
                  placeholder=""
                  error={touched.fullName && errors.fullName}
                  touched={touched.fullName}
                />
                <PhoneNumber
                  label={t("home.map_home.second_sheet.fields.contact.label", {
                    ns: "home",
                  })}
                  onBlur={handleBlur("contact")}
                  onChangeText={handleChange("contact")}
                  value={values.contact}
                  placeholder=""
                  error={touched.contact && errors.contact}
                  touched={touched.contact}
                  keyboardType="number-pad"
                  handleChangeCode={handleChange("countryCode")}
                />
                <Input
                  label={t("home.map_home.second_sheet.fields.room.label", {
                    ns: "home",
                  })}
                  onBlur={handleBlur("roomNumber")}
                  onChangeText={handleChange("roomNumber")}
                  value={values.roomNumber}
                  placeholder=""
                  error={touched.roomNumber && errors.roomNumber}
                  touched={touched.roomNumber}
                />
                <Select
                  label={t(
                    "home.map_home.second_sheet.fields.passengers.label",
                    {
                      ns: "home",
                    }
                  )}
                  placeholder=""
                  options={passengerOptions}
                  onSelect={(val: string) =>
                    setFieldValue("numberOfPassengers", val)
                  }
                  value={String(values.numberOfPassengers)}
                  error={
                    touched.numberOfPassengers ? errors.numberOfPassengers : ""
                  }
                  touched={touched.numberOfPassengers}
                />
                <Select
                  label={t("home.map_home.second_sheet.fields.luggage.label", {
                    ns: "home",
                  })}
                  placeholder=""
                  options={luggageOptions}
                  onSelect={(val: string) =>
                    setFieldValue("numberOfLuggages", val)
                  }
                  value={String(values.numberOfLuggages)}
                  error={
                    touched.numberOfLuggages ? errors.numberOfLuggages : ""
                  }
                  touched={touched.numberOfLuggages}
                />
              </VStack>

              <Button onPress={() => handleSubmit()} stretch>
                {t("home.next", { ns: "home" })}
              </Button>
            </ScrollView>
          );
        }}
      </Formik>
    </Pressable>
  );
};
