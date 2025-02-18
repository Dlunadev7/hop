import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Container, Header, Input } from "@/components";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { getUserLogged, updateUser } from "@/services/auth.service";
import { userRoles } from "@/utils/enum/role.enum";
import { Avatar, AvatarHopper, Location } from "@/assets/svg";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/components/button/button.component";
import * as Yup from "yup";
import { Formik } from "formik";
import { Text } from "@/components/text/text.component";
import { Colors } from "@/constants/Colors";
import { useFilePicker } from "@/hooks/use-document-picker.hook";
import { useAuth } from "@/context/auth.context";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
} from "@/components/ui/actionsheet";
import { useRequestLocationPermission } from "@/hooks/use-location.hook";
import { AuthRoutesLink } from "@/utils/enum/auth.routes";
import { useGetCoordinatesFromAddress } from "@/hooks/get-direction.hook";
import { SearchIcon } from "@/components/ui/icon";
import { validationSchema } from "@/schemas/update-profile.schema";
import { KeyboardContainer } from "@/components/keyboard/keyboard.component";
import { updateUserData, uploadPicture } from "@/services/user.service";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function PersonalData() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data, isLoading } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
    refreshInterval: 5,
  });
  const { state, updatePayload } = useAuth();
  const { pickImage, selectedImages } = useFilePicker();
  const { locations, setSelectedLocation, geocodeAddress } =
    useGetCoordinatesFromAddress();
  const { requestLocationPermission } = useRequestLocationPermission({
    url: AuthRoutesLink.MAP,
    step: 1,
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  const [showActionsheet, setShowActionsheet] = useState(false);

  const schema = validationSchema(t);

  const handleSearch = (searchText: string) => {
    if (searchText.trim()) {
      geocodeAddress(searchText);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={t("profile.personal_data.title", { ns: "profile" })}
          edit={!isEditable}
          arrow
          onPressArrow={() => router.back()}
          onPressEdit={() => setIsEditable(true)}
        />
      ),
    });
  }, [navigator, isEditable]);

  const handleSubmit = async (values: { email: string; address: string }) => {
    setLoading(true);
    try {
      await updateUserData(data?.id!, {
        email: values.email,
        userInfo: {
          address: {
            address: state.user_info.address,
            latitude: state.user_info.latitude,
            longitude: state.user_info.longitude,
          },
        },
      });

      if (selectedImages.length > 0) {
        await uploadPicture(data?.id!, selectedImages[0]);
      }

      router.back();
    } catch (error) {
      showToast({
        message: t("server_error", { ns: "utils" }),
        action: "error",
        duration: 3000,
        placement: "bottom",
      });
    } finally {
      updatePayload({
        user_info: {
          address: "",
          latitude: "",
          longitude: "",
        },
      });
      setLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardContainer>
        <Pressable
          disabled={!isEditable}
          className="items-center justify-center"
          style={styles.box}
          onPress={() => pickImage(0, false)}
        >
          {data?.userInfo.profilePic || selectedImages[0] ? (
            <Skeleton
              variant="rounded"
              className="rounded-full"
              style={styles.skeleton_image}
              isLoaded={!isLoading}
            >
              <Image
                source={{
                  uri: selectedImages[0]
                    ? selectedImages[0].uri
                    : data?.userInfo.profilePic,
                }}
                width={124}
                height={124}
                className="rounded-full"
              />
            </Skeleton>
          ) : data?.role === userRoles.USER_HOPPER ? (
            <AvatarHopper width={124} height={124} />
          ) : (
            <Avatar width={124} height={124} />
          )}
          {isEditable && (
            <Text
              fontSize={12}
              fontWeight={300}
              textColor={Colors.DARK_GREEN}
              className="mt-4"
            >
              {t("profile.personal_data.picture", { ns: "profile" })}
            </Text>
          )}
        </Pressable>
        <Formik
          initialValues={{
            firstName: data?.userInfo.firstName || "",
            lastName: data?.userInfo.lastName || "",
            email: data?.email || "",
            rut: data?.userInfo.rut || "",
            address: data?.userInfo?.home_address?.address || "",
            birthDate: "",
          }}
          validationSchema={schema}
          onSubmit={handleSubmit}
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
            useEffect(() => {
              if (state.user_info.address) {
                setFieldValue("address", state.user_info.address);
              }
            }, [state.user_info.address]);

            return (
              <VStack className="mt-12 gap-4">
                <HStack space="md">
                  <Input
                    label={t("profile.personal_data.fields.name.label", {
                      ns: "profile",
                    })}
                    value={values.firstName}
                    onBlur={handleBlur("firstName")}
                    onChangeText={handleChange("firstName")}
                    placeholder=""
                    stretch
                    isDisabled
                    editable={false}
                  />
                  <Input
                    label={t("profile.personal_data.fields.last_name.label", {
                      ns: "profile",
                    })}
                    value={values.lastName}
                    onBlur={handleBlur("lastName")}
                    onChangeText={handleChange("lastName")}
                    placeholder=""
                    stretch
                    isDisabled
                    editable={false}
                  />
                </HStack>
                <Input
                  label={t("profile.personal_data.fields.email.label", {
                    ns: "profile",
                  })}
                  value={values.email}
                  onBlur={handleBlur("email")}
                  onChangeText={handleChange("email")}
                  placeholder=""
                  stretch
                  isDisabled={!isEditable}
                  editable={isEditable}
                  isInvalid={touched.email && !!errors.email}
                  error={touched.email && errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Input
                  label={t("profile.personal_data.fields.rut.label", {
                    ns: "profile",
                  })}
                  value={values.rut}
                  onBlur={handleBlur("rut")}
                  onChangeText={handleChange("rut")}
                  placeholder=""
                  stretch
                  isDisabled
                  editable={false}
                />
                <Box className="gap-4 ">
                  <Input
                    label={t("profile.personal_data.fields.address.label", {
                      ns: "profile",
                    })}
                    onBlur={handleBlur("address")}
                    onChangeText={(val: string) => {
                      setFieldValue("address", val);

                      if (val.trim() === "") {
                        updatePayload({
                          user_info: {
                            ...state.user_info,
                            address: "",
                            latitude: "",
                            longitude: "",
                          },
                        });
                      }
                    }}
                    placeholder=""
                    value={
                      values.address
                        ? values.address
                        : String(state.user_info.address)
                    }
                    error={touched?.address && errors?.address}
                    touched={touched?.address}
                    stretch
                    onPress={() => {
                      isEditable ? setShowActionsheet(true) : {};
                    }}
                    editable={
                      (isEditable && Boolean(values.address)) ||
                      (isEditable && Boolean(state.user_info.address))
                    }
                    isDisabled={!isEditable}
                    pressable={
                      !Boolean(values.address) ||
                      !Boolean(state.user_info.address)
                    }
                  />

                  {isEditable && (
                    <Pressable onPress={() => requestLocationPermission()}>
                      <HStack space="xs">
                        <Location color={Colors.DARK_GREEN} width={14} />
                        <Text
                          className="text-xs font-medium"
                          textColor={Colors.DARK_GREEN}
                        >
                          {t("signup.step_1.mark_map", { ns: "auth" })}
                        </Text>
                      </HStack>
                    </Pressable>
                  )}
                </Box>
                <Actionsheet
                  isOpen={showActionsheet}
                  onClose={() => setShowActionsheet(false)}
                  snapPoints={[70]}
                >
                  <ActionsheetBackdrop />
                  <ActionsheetContent className="pb-10">
                    <ActionsheetDragIndicatorWrapper>
                      <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <View style={styles.search_bar_container}>
                      <Input
                        placeholder={t("map_sheet", { ns: "utils" })}
                        label=""
                        onBlur={() => {}}
                        onChangeText={handleSearch}
                        className=""
                        icon={SearchIcon}
                        rightIcon
                        size="sm"
                      />
                    </View>
                    <ActionsheetFlatList
                      data={locations}
                      renderItem={({ item }: any) => (
                        <>
                          <Pressable
                            onPress={() => {
                              setSelectedLocation(item);
                              setFieldValue(
                                "address",
                                `${item.name.split(",")[0]},${
                                  item.name.split(",")[1]
                                }.`
                              );
                              setShowActionsheet(false);
                            }}
                            className="py-2.5 px-4 border-b border-[#9FE4DD] bg-white rounded-lg mb-2.5"
                          >
                            <Box className="gap-4">
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: "500",
                                  color: "#333",
                                }}
                              >
                                {item.name}
                              </Text>
                            </Box>
                          </Pressable>
                        </>
                      )}
                      contentContainerClassName="gap-4"
                      keyExtractor={(item: any) => item.id.toString()}
                    />
                  </ActionsheetContent>
                </Actionsheet>
                <Input
                  label={t("profile.personal_data.fields.birth_date.label", {
                    ns: "profile",
                  })}
                  value={values.birthDate}
                  onBlur={handleBlur("birthDate")}
                  onChangeText={handleChange("birthDate")}
                  placeholder=""
                  stretch
                  isDisabled
                  editable={false}
                />
                {isEditable && (
                  <Button onPress={() => handleSubmit()}>
                    {loading ? (
                      <ActivityIndicator color={Colors.WHITE} />
                    ) : (
                      t("profile.personal_data.button", { ns: "profile" })
                    )}
                  </Button>
                )}
              </VStack>
            );
          }}
        </Formik>
      </KeyboardContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 28,
  },
  formulary: {
    gap: 16,
    flex: 1,
  },
  search_bar_container: {
    width: "100%",
    marginBottom: 24,
    marginTop: 24,
  },
  skeleton_image: {
    width: 124,
    height: 124,
  },
});
