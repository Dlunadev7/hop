import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Modal, ModalBackdrop } from "../ui/modal";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";
import { Button } from "../button/button.component";
import { useTranslation } from "react-i18next";

interface CalendarProps {
  isVisible: boolean;
  date: Date;
  maximumDate?: Date;
  minimumDate?: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
  setOpen?: (open: boolean) => void;
  type?: "date" | "time";
}

const CalendarPickerIOS: React.FC<CalendarProps> = ({
  isVisible,
  date,
  type = "date",
  maximumDate,
  minimumDate,
  onDateChange,
  onClose,
  setOpen,
}) => {
  const { t } = useTranslation();
  const onChange = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || date;

    if (currentDate.getDate() !== date.getDate()) {
      onDateChange(currentDate);
      onClose();
    }
  };

  const onChangeTime = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || date;

    if (currentDate.getTime() !== date.getTime()) {
      onDateChange(currentDate);
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isVisible} useRNModal className="px-4">
      <ModalBackdrop />

      <View style={styles.calendar}>
        <DateTimePicker
          value={date}
          mode={type}
          display={type === "date" ? "inline" : "spinner"}
          onChange={type === "date" ? onChange : onChangeTime}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />

        {type === "time" && (
          <Button onPress={() => onClose()}>
            {t("accept", { ns: "utils" })}
          </Button>
        )}
      </View>
    </Modal>
  );
};

const CalendarPickerAndroid: React.FC<CalendarProps> = ({
  isVisible,
  date,
  type = "date",
  minimumDate,
  onDateChange,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      DateTimePickerAndroid.open({
        value: date,
        onChange: (event: unknown, selectedDate?: Date) => {
          const currentDate = selectedDate || date;
          onDateChange(currentDate);
          onClose();
        },
        mode: type,
        display: "default",
        minimumDate: minimumDate,
      });
    }
  }, [isVisible]);

  return null;
};

export const Calendar = (props: CalendarProps) => {
  const { setOpen, maximumDate, minimumDate, ...rest } = props;
  return Platform.OS === "ios" ? (
    <CalendarPickerIOS {...rest} minimumDate={minimumDate} setOpen={setOpen} />
  ) : (
    <CalendarPickerAndroid {...rest} minimumDate={minimumDate} />
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.LIGHT_GRADIENT_2,
    borderRadius: 8,
  },
  calendar: {
    backgroundColor: Colors.LIGHT_GRADIENT_2,
    borderRadius: 8,
    padding: 8,
  },
});
