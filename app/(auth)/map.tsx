import { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Text } from "@/components/text/text.component";
import { Input } from "@/components";
import { useGetAddressFromCoordinates } from "@/hooks/get-direction.hook";
import { Button } from "@/components/button/button.component";
import { ArrowLeftRounded, LocationFilled } from "@/assets/svg";
import { VStack } from "@/components/ui/vstack";
import { AssetsImages } from "@/assets/images";
import { Fab, FabIcon } from "@/components/ui/fab";
import { useAuth } from "@/context/auth.context";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";

export default function MapSheet() {
  const { address, getAddress, selectedLocation } =
    useGetAddressFromCoordinates();
  const { location } = useAuth();
  const { step } = useRoute().params as unknown as { step: string };
  const { updatePayload } = useAuth();
  const { t } = useTranslation();
  const onPressMap = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    getAddress(latitude, longitude);
  };

  const onConfirmData = () => {
    const newPayload = {
      address: address,
      latitude: selectedLocation?.latitude,
      longitude: selectedLocation?.longitude,
    };

    updatePayload(
      step === "3"
        ? {
            hotel_info: newPayload,
          }
        : {
            user_info: newPayload,
          }
    );

    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Fab
        placement="top left"
        onPress={() => router.back()}
        className="bg-[#E1F5F3] w-[50px] h-[50px]"
      >
        <FabIcon as={ArrowLeftRounded} width={30} />
      </Fab>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="flex-1">
          <MapView
            style={styles.map}
            showsUserLocation={true}
            initialRegion={{
              latitude: location?.latitude || 0,
              longitude: location?.longitude || 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={onPressMap}
          >
            {selectedLocation && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                }}
              >
                <View className="w-[30px] h-[30px]">
                  <Image
                    source={AssetsImages.marker_icon}
                    className="w-full h-full"
                  />
                </View>
              </Marker>
            )}
          </MapView>
          <View style={styles.actionSheet}>
            <Text fontSize={24} fontWeight={400} className="mb-6">
              {t("signup.step_1.mark_map", { ns: "auth" })}
            </Text>
            <VStack className="gap-5">
              <Input
                label=""
                value={address ?? ""}
                editable={false}
                placeholder={t("signup.step_1.select_map", { ns: "auth" })}
                onChangeText={() => {}}
                onBlur={() => {}}
                icon={LocationFilled}
                leftIcon
              />

              <Button onPress={onConfirmData}>
                {t("signup.step_1.confirm_address", { ns: "auth" })}
              </Button>
            </VStack>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    position: "absolute",
    bottom: 100,
    left: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  actionSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingVertical: 24,
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
  },
});
