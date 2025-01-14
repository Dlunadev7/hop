import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Modal, ModalBackdrop } from "../ui/modal";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";

interface CalendarProps {
  isVisible: boolean;
  date: Date;
  maximumDate?: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
  setOpen?: (open: boolean) => void;
}

const CalendarPickerIOS: React.FC<CalendarProps> = ({
  isVisible,
  date,
  maximumDate,
  onDateChange,
  onClose,
  setOpen,
}) => {
  const onChange = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || date;

    // Verificamos si la fecha seleccionada es un día diferente al actual
    if (currentDate.getDate() !== date.getDate()) {
      onDateChange(currentDate); // Solo actualizamos si el día cambió
      setOpen && setOpen(false);
    }
  };
  return (
    <Modal onClose={onClose} isOpen={isVisible} useRNModal className="px-4">
      <ModalBackdrop />

      <DateTimePicker
        value={date}
        mode="date"
        display="inline"
        onChange={onChange}
        maximumDate={maximumDate}
        accentColor={Colors.PRIMARY}
        style={styles.calendar}
      />
    </Modal>
  );
};

const CalendarPickerAndroid: React.FC<CalendarProps> = ({
  isVisible,
  date,
  maximumDate,
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
        mode: "date",
        display: "default",
        maximumDate: maximumDate,
      });
    }
  }, [isVisible]);

  return null;
};

export const Calendar = (props: CalendarProps) => {
  const { setOpen, ...rest } = props;
  const maximumDate = dayjs().subtract(18, "year").toDate();

  return Platform.OS === "ios" ? (
    <CalendarPickerIOS {...rest} setOpen={setOpen} maximumDate={maximumDate} />
  ) : (
    <CalendarPickerAndroid {...rest} maximumDate={maximumDate} />
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
