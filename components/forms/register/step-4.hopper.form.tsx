import { Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { Text } from "@/components/text/text.component";
import { RegisterType } from "@/utils/types/register.type";
import { useAuth } from "@/context/auth.context";
import { updateVehicleUser } from "@/services/auth.service";
import { VehicleUser } from "@/utils/interfaces/auth.interface";
import { useToast } from "@/hooks/use-toast";
import { Select } from "@/components/select/select.component";
import { vehicles } from "@/constants/vehicles.constants";
import { Button } from "@/components/button/button.component";
import capitalizeWords from "@/helpers/capitalize-words";

type formProps = {
  payloadValues: RegisterType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
  extraData: string;
  role: string;
};

export default function Step4Hopper(props: formProps) {
  const { setStep, extraData } = props;
  const { t } = useTranslation();
  const { state } = useAuth();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [formValues, setFormValues] = useState({
    passengers: "",
    luggageSpace: "",
    specialLuggage: "",
    accessibility: "",
  });
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const handleVehicleSelect = (vehicleType: string) => {
    const selectedVehicle = vehicles.find((item) => item.value === vehicleType);

    if (selectedVehicle) {
      setFormValues({
        passengers: selectedVehicle.passengers || "",
        luggageSpace: selectedVehicle.luggageSpace || "",
        specialLuggage: selectedVehicle.specialLuggage || "",
        accessibility: formValues.accessibility,
      });
    }
  };

  const handleRegisterStep4 = async (values: VehicleUser) => {
    setLoading(true);
    try {
      await updateVehicleUser(extraData, values);
      setStep(5);
    } catch (error) {
      showToast({
        message: t("server_error", { ns: "utils" }),
        action: "error",
        duration: 3000,
        placement: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={() => setShowTooltip(false)}>
      <View style={styles.formulary} className="pb-4">
        <Text fontSize={16} fontWeight={400}>
          {t("signup.step_4_hopper.title")}
        </Text>
        <VStack space="lg">
          <Select
            label={t("signup.step_4_hopper.fields.type.label")}
            placeholder={t("signup.step_4_hopper.fields.type.placeholder")}
            onSelect={(val) => {
              setSelectedVehicle(val);
              handleVehicleSelect(val);
            }}
            options={vehicles.map((item) => ({
              value: item.value,
              label: item.value,
            }))}
            value={capitalizeWords(selectedVehicle)}
          />
          <Select
            label={t("signup.step_4_hopper.fields.passengers.label")}
            placeholder=""
            onSelect={(val) =>
              setFormValues((prev) => ({ ...prev, passengers: val }))
            }
            options={[
              { label: "1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
              { label: "4", value: "4" },
              { label: "5", value: "5" },
              { label: "6", value: "6" },
              { label: "7", value: "7" },
            ]}
            value={formValues.passengers}
            disabled
          />
          <Select
            label={t("signup.step_4_hopper.fields.accessibility.label")}
            placeholder=""
            onSelect={(val) =>
              setFormValues((prev) => ({ ...prev, accessibility: val }))
            }
            options={[
              { label: "Si", value: "si" },
              { label: "No", value: "no" },
            ]}
            value={capitalizeWords(formValues.accessibility)}
            info={t("accessibility", { ns: "utils" })}
            setShowTooltip={setShowTooltip}
            showTooltip={showTooltip}
          />
          <Select
            label={t("signup.step_4_hopper.fields.luggage_space.label")}
            placeholder=""
            onSelect={(val) =>
              setFormValues((prev) => ({ ...prev, luggageSpace: val }))
            }
            options={[
              { label: "1-3 bultos", value: "1-3" },
              { label: "4+ bultos", value: "4+" },
            ]}
            value={capitalizeWords(formValues.luggageSpace)}
            disabled
          />
          <Select
            label={t("signup.step_4_hopper.fields.luggage_special.label")}
            placeholder=""
            onSelect={(val) =>
              setFormValues((prev) => ({ ...prev, specialLuggage: val }))
            }
            options={[
              { label: "Si", value: "si" },
              { label: "No", value: "no" },
            ]}
            value={capitalizeWords(formValues.specialLuggage)}
            disabled
            // info={t("accessibility", { ns: "utils" })}
            // setShowTooltip={setShowTooltip}
            // showTooltip={showTooltip}
          />
        </VStack>
        <Button
          onPress={() =>
            handleRegisterStep4({
              type: selectedVehicle,
              passengers: formValues.passengers,
              suitcases: formValues.luggageSpace,
              specialLuggage: formValues.specialLuggage,
              accessibility: formValues.accessibility,
            })
          }
        >
          {t("signup.step_2.buttons.next")}
        </Button>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  formulary: {
    gap: 16,
    paddingBottom: 120,
    flex: 1,
  },
  mark_map: {
    color: Colors.PRIMARY,
  },
});
