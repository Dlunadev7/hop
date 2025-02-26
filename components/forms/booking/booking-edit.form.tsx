import { View, StyleSheet, ActivityIndicator } from "react-native";
import React, { ReactElement, useState } from "react";
import { HStack } from "@/components/ui/hstack";
import Input from "@/components/input/input.component";
import { Colors } from "@/constants/Colors";
import {
  CalendarActive,
  ClockActive,
  ElectricCar,
  LocationFilled,
  Luggage,
  ProfileActive,
  Sedan,
  Send,
  Van,
} from "@/assets/svg";
import dayjs from "dayjs";
import { Calendar } from "@/components/calendar/calendar.component";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/text/text.component";
import { BookingResponse } from "@/utils/interfaces/booking.interface";
import { VStack } from "@/components/ui/vstack";
import { Button } from "@/components/button/button.component";
import * as Yup from "yup";
import { Formik } from "formik";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { updateTravel } from "@/services/book.service";
import { router } from "expo-router";
import { travelTypeValues } from "@/utils/enum/travel.enum";
import { PhoneNumber } from "@/components";
import { User } from "@/utils/interfaces/auth.interface";

export default function BookingEditForm(props: {
  formattedDate: string;
  formattedTime: string;
  data: BookingResponse;
  id: string;
  user: User;
}) {
  const { formattedDate, formattedTime, data, id, user } = props;

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [type, setType] = useState<"date" | "time">("date");
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const openDatePicker = () => {
    setShowCalendar(true);
    setType("date");
  };

  const openTimePicker = () => {
    setShowCalendar(true);
    setType("time");
  };

  const handleDateChange = (selectedDate: Date) => {
    if (type === "date") {
      setDate(selectedDate);
      setTime(null);
    } else {
      setTime(selectedDate);
      setDate((prevDate) =>
        dayjs(prevDate || new Date())
          .hour(dayjs(selectedDate).hour())
          .minute(dayjs(selectedDate).minute())
          .toDate()
      );
    }
  };
  const formattedDateLocal = date
    ? dayjs(date).format("DD/MM/YYYY")
    : formattedDate;
  const formattedTimeLocal = time ? dayjs(time).format("HH:mm") : formattedTime;

  const vehicle: { [key: string]: ReactElement } = {
    VANS: <Van />,
    ELECTRIC: <ElectricCar />,
    SEDAN: <Sedan />,
  };

  const vehicleName: { [key: string]: string } = {
    SEDAN: "Sedan",
    VANS: "Van",
    ELECTRIC: "Electric Car",
  };

  const validationSchema = Yup.object().shape({
    passengerName: Yup.string()
      .min(3, "Debe tener al menos 3 caracteres")
      .optional(),
    passengerContact: Yup.string()
      .matches(/^[0-9]+$/, "Solo se permiten números")
      .min(7, "Debe tener al menos 7 dígitos")
      .optional(),
    passengerFligth: Yup.string()
      .matches(/^[a-zA-Z0-9]+$/, "Debe ser alfanumérico")
      .optional(),
  });

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      programedTo: date ? date : data.programedTo,
      passengerContactCountryCode: values.countryCode,
    };

    setLoading(true);
    await updateTravel(id, payload);

    router.back();
  };

  return (
    <KeyboardContainer>
      <View className="gap-4">
        <HStack style={styles.hour} className="gap-2">
          <Input
            label=""
            onBlur={() => {}}
            onChangeText={() => {}}
            placeholder="DD/MM/AAAA"
            leftIcon
            icon={CalendarActive}
            stretch
            onPress={openDatePicker}
            editable={false}
            pressable
            value={formattedDateLocal}
          />
          <Input
            label=""
            onBlur={() => {}}
            onChangeText={() => {}}
            placeholder="HH : MM"
            leftIcon
            icon={ClockActive}
            stretch
            onPress={openTimePicker}
            editable={false}
            pressable
            value={formattedTimeLocal}
          />
        </HStack>
      </View>
      {showCalendar && (
        <Calendar
          type={type}
          isVisible={true}
          onClose={() => setShowCalendar(false)}
          onDateChange={handleDateChange}
          date={
            type === "date"
              ? date || new Date()
              : dayjs(date || new Date())
                  .hour(dayjs(time || new Date()).hour())
                  .minute(dayjs(time || new Date()).minute())
                  .toDate()
          }
          minimumDate={new Date()}
        />
      )}
      <Box className="mt-6 gap-3">
        <Text fontSize={18} fontWeight={400} textColor={Colors.GRAY}>
          Datos del viaje
        </Text>
        <VStack className="px-4 gap-3">
          <Input
            label=""
            onBlur={() => {}}
            onChangeText={() => {}}
            placeholder={String(data?.from?.address)}
            leftIcon
            icon={Send}
            stretch
            value=""
            editable={false}
            isDisabled={true}
          />
          <Input
            label=""
            onBlur={() => {}}
            onChangeText={() => {}}
            placeholder={String(data?.to?.address)}
            leftIcon
            icon={LocationFilled}
            stretch
            value=""
            editable={false}
            isDisabled={true}
          />
        </VStack>
      </Box>
      <Box className="mt-6">
        <Text fontSize={18} fontWeight={400} textColor={Colors.GRAY}>
          Tipo de vehículo
        </Text>
        <HStack space="md" className="px-4 gap-3 mt-6 items-start">
          {vehicle[data?.vehicleType!]}
          <Box className="gap-2 justify-between">
            <Text fontSize={20} fontWeight={600}>
              {vehicleName[data?.vehicleType!]}
            </Text>
            <VStack className="mt-2 gap-2">
              <Box className="flex-row">
                <ProfileActive width={16} height={16} />
                <Text fontSize={14} fontWeight={400} textColor={Colors.GRAY}>
                  {data?.totalPassengers} pasajeros
                </Text>
              </Box>
              <Box className="flex-row">
                <Luggage />
                <Text fontSize={14} fontWeight={400} textColor={Colors.GRAY}>
                  {data?.totalSuitCases} maletas
                </Text>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>
      <Formik
        initialValues={{
          passengerName: data.passengerName || "",
          passengerContact: data.passengerContact || "",
          passengerFligth: data.passengerFligth || "",
          countryCode: data.passengerContactCountryCode || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
            <Box className="mt-6 mb-8">
              <Text fontSize={18} fontWeight={400} textColor={Colors.GRAY}>
                Datos del viaje
              </Text>

              <VStack className="mt-6 gap-3 px-4">
                <Input
                  label="Nombre completo"
                  onBlur={handleBlur("passengerName")}
                  onChangeText={handleChange("passengerName")}
                  placeholder={data.passengerName}
                  value={values.passengerName}
                  stretch
                  error={touched.passengerName && errors.passengerName}
                />
                <PhoneNumber
                  label="Contacto"
                  onBlur={handleBlur("passengerContact")}
                  onChangeText={handleChange("passengerContact")}
                  placeholder={data.passengerContact}
                  value={values.passengerContact}
                  stretch
                  error={touched.passengerContact && errors.passengerContact}
                  keyboardType="number-pad"
                  phoneNumber={values.countryCode}
                  handleChangeCode={handleChange("countryCode")}
                />
                {data.type === travelTypeValues.PICKUP && (
                  <>
                    <Input
                      label="Número de vuelo"
                      onBlur={handleBlur("passengerFligth")}
                      onChangeText={handleChange("passengerFligth")}
                      placeholder={data.passengerFligth}
                      value={values.passengerFligth}
                      stretch
                      error={touched.passengerFligth && errors.passengerFligth}
                    />
                  </>
                )}
              </VStack>
            </Box>
            <Button onPress={() => handleSubmit()} stretch>
              {loading ? (
                <ActivityIndicator color={Colors.WHITE} />
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </>
        )}
      </Formik>
    </KeyboardContainer>
  );
}

const styles = StyleSheet.create({
  floating_content: {
    backgroundColor: Colors.LIGHT_GRADIENT_1,
    marginTop: 16,
    height: "auto",
    borderRadius: 32,
  },
  badge: {
    backgroundColor: Colors.PRIMARY,
    alignSelf: "flex-start",
  },
  hour: {
    marginTop: 12,
  },
});
