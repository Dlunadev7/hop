import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Container, Header, Select } from "@/components";
import { router, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { VStack } from "@/components/ui/vstack";
import { vehicles } from "@/constants/vehicles.constants";
import capitalizeWords from "@/helpers/capitalize-words";
import useSWR from "swr";
import { getVehicleData } from "@/services/user.service";
import { getUserLogged, updateVehicleUser } from "@/services/auth.service";
import { Button } from "@/components/button/button.component";
import { VehicleUser } from "@/utils/interfaces/auth.interface";
import { useToast } from "@/hooks/use-toast";
import { Colors } from "@/constants/Colors";
import { CircleArrowRight } from "@/assets/svg";
import { ProfileRoutesLink } from "@/utils/enum/profile.routes";

export default function VehicleData() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const { data: user } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
    refreshInterval: 5,
  });

  const { data } = useSWR(
    `/user-vehicle/user/${user?.id!}`,
    async () => getVehicleData(user?.id!),
    {
      revalidateOnFocus: true,
      refreshInterval: 5,
    }
  );

  const navigation = useNavigation();
  const [isEditable, setIsEditable] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    passengers: "",
    luggageSpace: "",
    specialLuggage: "",
    accessibility: "",
  });

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

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={t("profile.vehicle.title", { ns: "profile" })}
          edit={!isEditable}
          arrow
          onPressArrow={() => router.back()}
          onPressEdit={() => setIsEditable(true)}
        />
      ),
    });
  }, [navigator, isEditable]);

  const handleSubmit = async (values: VehicleUser) => {
    setLoading(true);
    console.log(values);
    try {
      await updateVehicleUser(user?.id!, values);

      router.back();
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
    <Container>
      <VStack
        space="lg"
        style={styles.formulary}
        className="flex-1 justify-between"
      >
        <>
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
            value={
              selectedVehicle
                ? capitalizeWords(selectedVehicle)
                : capitalizeWords(data?.type || "")
            }
            disabled={!isEditable}
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
            value={
              selectedVehicle ? formValues.passengers : String(data?.passengers)
            }
            disabled={!isEditable}
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
            value={
              selectedVehicle
                ? capitalizeWords(formValues.accessibility)
                : data?.accessibility
                ? "Si"
                : "No"
            }
            info={t("accessibility", { ns: "utils" })}
            setShowTooltip={setShowTooltip}
            showTooltip={showTooltip}
            disabled={!isEditable}
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
            value={
              selectedVehicle
                ? capitalizeWords(formValues.luggageSpace)
                : data?.suitcases
                ? "Si"
                : "No"
            }
            disabled={!isEditable}
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
            value={
              selectedVehicle
                ? capitalizeWords(formValues.specialLuggage)
                : data?.specialLuggage
                ? "Si"
                : "No"
            }
            disabled={!isEditable}
          />
          <Pressable
            style={{ backgroundColor: Colors.PRIMARY }}
            className={`p-2 h-11 w-72 rounded-2xl px-3 flex-row items-center gap-2 self-center justify-center hover:none`}
            onPress={() => router.push(ProfileRoutesLink.DOCUMENTATION)}
          >
            <Text
              className={`text-lg font-semibold text-[${Colors.DARK_GREEN}] hover:none`}
            >
              {t("profile.vehicle.see_docs", { ns: "profile" })}
            </Text>
            <CircleArrowRight color={Colors.DARK_GREEN} />
          </Pressable>
        </>
        <Button
          onPress={() =>
            handleSubmit({
              type: selectedVehicle,
              passengers: formValues.passengers,
              suitcases: formValues.luggageSpace,
              specialLuggage: formValues.specialLuggage,
              accessibility: formValues.accessibility,
            })
          }
        >
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            t("profile.personal_data.button", { ns: "profile" })
          )}
        </Button>
      </VStack>
    </Container>
  );
}

const styles = StyleSheet.create({
  formulary: {
    marginTop: 28,
  },
});
