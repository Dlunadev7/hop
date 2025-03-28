import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Container, Header } from "@/components";
import { router, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/text/text.component";
import { AlertCircleIcon, CloseCircleIcon, Icon } from "@/components/ui/icon";
import Tooltip from "@/components/tooltip/tooltip.component";
import { Colors } from "@/constants/Colors";
import {
  Documents,
  DocumentUpload,
  Gallery,
  SuccessRounded,
} from "@/assets/svg";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { useFilePicker } from "@/hooks/use-document-picker.hook";
import { documentationHopper } from "@/constants/documentation.constants";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";
import { getUserLogged, updateUserDocuments } from "@/services/auth.service";
import { getUserDocumentation } from "@/services/user.service";
import { Button } from "@/components/button/button.component";
import WebView from "react-native-webview";
import axiosInstance from "@/axios/axios.config";
import axios from "axios";

const { width } = Dimensions.get("window");

export default function Documentation() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { data: user } = useSWR("/user/logged", getUserLogged, {
    revalidateOnFocus: true,
    refreshInterval: 5,
  });

  const { data, mutate } = useSWR(
    `/user-documents/user/${user?.id!}`,
    async () => getUserDocumentation(user?.id!),
    {
      revalidateOnFocus: true,
      refreshInterval: 5,
    }
  );

  const {
    selectedDocuments,
    selectedImages,
    pickDocument,
    removeImage,
    resetDocuments,
    removeDocument,
    pickImage,
  } = useFilePicker();
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const documentation = documentationHopper(t);
  const [documentsByItem, setDocumentsByItem] = useState<Record<string, any[]>>(
    {}
  );
  const [openActionSheetIndex, setOpenActionSheetIndex] = useState<
    number | null
  >(null);
  const [openActionSheetPdf, setOpenActionSheetPdf] = useState<number | null>(
    null
  );
  const [imagesByItem, setImagesByItem] = useState<any>([]);
  const [urls, setUrls] = useState<any[]>([]);

  const [selectedPdf, setSelectedPdf] = useState<string>("");
  const handleOpenActionSheet = (index: number) => {
    setOpenActionSheetIndex(index);
  };

  const handleCloseActionSheet = () => {
    setOpenActionSheetIndex(null);
  };

  const handleOpenPdfActionSheet = (index: number) => {
    setOpenActionSheetIndex(index);
  };

  const handleClosePdfActionSheet = () => {
    setOpenActionSheetIndex(null);
    setSelectedPdf("");
  };

  const handlePickDocument = (
    itemId: number,
    type: string,
    multiple: boolean,
    name: string
  ) => {
    const totalDocuments =
      selectedDocuments.length + (documentsByItem[itemId]?.length || 0);

    if (totalDocuments > 5) {
      showToast({
        message: t("max_documents_reached", { ns: "utils" }),
        action: "error",
        duration: 3000,
        placement: "bottom",
      });
      return;
    }
    pickDocument(itemId, [type], false, name);
    resetDocuments();
  };

  const handleRemoveDocument = (
    folder: string,
    itemId: number,
    docUri: string
  ) => {
    setDocumentsByItem((prev) => {
      const currentDocuments = prev[folder] || [];
      return {
        ...prev,
        [folder]: currentDocuments.filter((doc) => doc.uri !== docUri),
      };
    });

    removeDocument(itemId, {
      uri: docUri,
      itemId: itemId,
      name: "",
    });
  };

  const handlePickImage = (itemId: number) => {
    pickImage(itemId);
  };

  const handleActionSheetSelection = (
    type: string,
    index: number,
    name: string
  ) => {
    if (type === "image") {
      handlePickImage(index);
    } else if (type === "document") {
      handlePickDocument(index, "*/*", true, name);
    }
  };

  // const handleRemoveImage = (uri: string, index: number) => {
  //   setImagesByItem((prev) => {
  //     const updatedImages = prev[index].filter((image) => image.uri !== uri);
  //     return {
  //       ...prev,
  //       [index]: updatedImages,
  //     };
  //   });
  //   removeImage(index, {
  //     uri: uri,
  //     itemId: index,
  //     name: "",
  //   });
  // };

  console.log(imagesByItem);

  const handleSubmitDocuments = async () => {
    setLoading(true);

    try {
      const requiredFields = {
        "imagesByItem[4]": imagesByItem,
        "Documento para seremi": documentsByItem["seremi"],
        "Documento para curriculum vitae": documentsByItem["curriculum_vitae"],
        "Documento para permissions": documentsByItem["permission"],
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        showToast({
          message: t("empty", { ns: "utils" }),
          action: "error",
          duration: 3000,
          placement: "bottom",
        });
        return;
      }

      const filterDocs = (docs: any) => {
        return docs?.filter((doc: any) => doc.name && doc.uri && doc.type);
      };

      const images = filterDocs(
        imagesByItem["4"]?.map(
          (doc: { uri: string; name: string; type: string }) => ({
            name: doc.name,
            uri: doc.uri,
            type: doc.type,
          })
        )
      );

      const seremiDoc = filterDocs(
        documentsByItem["seremi"]?.map(
          (doc: { uri: string; name: string; type: string }) => ({
            name: doc.name,
            uri: doc.uri,
            type: doc.type,
          })
        )
      );

      const driverResume = filterDocs(
        documentsByItem["curriculum_vitae"]?.map(
          (doc: { uri: string; name: string; type: string }) => ({
            name: doc.name,
            uri: doc.uri,
            type: doc.type,
          })
        )
      );

      const circulationPermit = filterDocs(
        documentsByItem["permission"]?.map(
          (doc: { uri: string; name: string; type: string }) => ({
            name: doc.name,
            uri: doc.uri,
            type: doc.type,
          })
        )
      );

      const passengerInsurance = filterDocs(
        documentsByItem["secure"]?.map(
          (doc: { uri: string; name: string; type: string }) => ({
            name: doc.name,
            uri: doc.uri,
            type: doc.type,
          })
        )
      );

      const payload = {
        ...(images &&
          images.length > 0 && {
            vehiclePictures: [...images, ...imagesByItem[0]],
          }),
        ...(seremiDoc && seremiDoc.length > 0 && { seremiDecree: seremiDoc }),
        ...(driverResume &&
          driverResume.length > 0 && { driverResume: driverResume }),
        ...(circulationPermit &&
          circulationPermit.length > 0 && {
            circulationPermit: circulationPermit,
          }),
        ...(passengerInsurance &&
          passengerInsurance.length > 0 && {
            passengerInsurance: passengerInsurance,
          }),
      };

      await updateUserDocuments(user?.id!, payload);
      router.back();
    } catch (error) {
      console.log("error", error);
      showToast({
        message: t("server_error", { ns: "utils" }),
        action: "error",
        duration: 3000,
        placement: "bottom",
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (
    doc: {
      name: string;
      uri: string;
      type: string;
    },
    type: string
  ) => {
    try {
      const formData = new FormData();

      const documentMap: Record<string, string> = {
        vehicle_picture: "vehiclePictures",
        permission: "circulationPermit",
        seremi: "seremiDecree",
        curriculum_vitae: "driverResume",
        secure: "passengerInsurance",
      };

      if (!type) {
        throw new Error("El tipo de documento es requerido.");
      }

      formData.append("file", null as any);
      formData.append("document", documentMap[type]);

      await axiosInstance.patch(`/user-documents/${user?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      mutate();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al actualizar el documento:", error.message);
        console.error("Código de estado:", error.response?.status);
        console.error("Detalles del error:", error.response?.data);
      } else {
        console.error("Error inesperado:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedDocuments.length > 0) {
      setDocumentsByItem((prev) => {
        const updatedDocuments = { ...prev };

        selectedDocuments.forEach((doc) => {
          if (!updatedDocuments[doc.folder!]) {
            updatedDocuments[doc.folder!] = [doc];
          } else {
            const currentDocuments = updatedDocuments[doc.folder!];
            const isDuplicate = currentDocuments.some(
              (existingDoc) => existingDoc.uri === doc.uri
            );

            if (!isDuplicate) {
              updatedDocuments[doc.folder!].push(doc);
            }
          }
        });

        return updatedDocuments;
      });
    }

    if (selectedImages && selectedImages.length > 0) {
      setImagesByItem((prev: any) => {
        const itemId = selectedImages[0]?.itemId;
        if (!itemId) return prev;

        const currentImages = prev[itemId] || [];
        const newImageUris = selectedImages.filter(
          (uri) => !currentImages.includes(uri)
        );

        return {
          ...prev,
          [itemId]: [...currentImages, ...newImageUris],
        };
      });
    }
  }, [selectedImages, selectedDocuments]);

  useEffect(() => {
    setDocumentsByItem({
      seremi: data?.seremiDecree && ([{ name: data?.seremiDecree }] as any),
      curriculum_vitae:
        data?.driverResume && ([{ name: data?.driverResume }] as any),
      permission:
        data?.circulationPermit && ([{ name: data?.circulationPermit }] as any),
      secure:
        data?.passengerInsurance &&
        ([{ name: data?.passengerInsurance }] as any),
      vehiclePictures:
        data?.vehiclePictures && ([{ name: data?.vehiclePictures }] as any),
    });

    if (data?.vehiclePictures) {
      setImagesByItem([
        data.vehiclePictures,
        ...selectedImages.map((item) => item.uri),
      ] as any);
    }
  }, [data]);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title={t("profile.documentation.title", { ns: "profile" })}
          arrow
          onPressArrow={() => router.back()}
        />
      ),
    });
  }, [navigator]);

  const imageWidth = (width - 2 * 28) / 3;

  useEffect(() => {
    const newUrls: any = Object.values(imagesByItem).flat();
    setUrls(newUrls.map((item: any) => (item.uri ? item.uri : item)));
  }, [imagesByItem]);

  return (
    <>
      <Container>
        <Box style={styles.content}>
          <VStack space="md" className="mb-8">
            {documentation.map((documentation, index) => (
              <Box key={index} className="gap-3">
                <HStack className="gap-2">
                  <Text
                    fontWeight={600}
                    fontSize={14}
                    textColor={Colors.DARK_GREEN}
                  >
                    {documentation.value}
                  </Text>
                  {documentation.info && (
                    <Pressable
                      className="w-full relative"
                      onPress={() => setShowTooltip(true)}
                    >
                      <Icon as={AlertCircleIcon} color={Colors.PRIMARY} />
                      {showTooltip && (
                        <Tooltip
                          documentation={documentation}
                          setShowTooltip={setShowTooltip}
                        />
                      )}
                    </Pressable>
                  )}
                </HStack>
                <Pressable
                  style={{ backgroundColor: Colors.PRIMARY }}
                  className="py-3 px-7 h-11 w-full rounded-xl flex-row items-center gap-2 self-center justify-center"
                  onPress={() => {
                    if (documentsByItem[documentation.name]?.length === 1) {
                      showToast({
                        message: t("max_documents_reached", { ns: "utils" }),
                        action: "error",
                        duration: 3000,
                        placement: "bottom",
                      });
                      return;
                    }
                    if (documentation.type === "pdf") {
                      handlePickDocument(
                        index,
                        "application/pdf",
                        true,
                        documentation.name
                      );
                    } else {
                      handleOpenActionSheet(index);
                    }
                  }}
                >
                  <Text textColor={Colors.DARK_GREEN} fontWeight={600}>
                    {t("signup.step_3.upload")}
                  </Text>
                  <DocumentUpload color={Colors.DARK_GREEN} />
                </Pressable>
                {index === 4 && Boolean(imagesByItem) && (
                  <ScrollView contentContainerStyle={styles.gridContainer}>
                    <HStack style={styles.row}>
                      {urls?.map((image: string, i: number) => {
                        return (
                          <View
                            style={[styles.imageWrapper, { width: imageWidth }]}
                            key={i}
                          >
                            <Image
                              className="rounded-lg"
                              source={{ uri: image }}
                              style={[styles.image, { width: imageWidth }]}
                            />
                          </View>
                        );
                      })}
                    </HStack>
                  </ScrollView>
                )}
                {documentsByItem[documentation.name] &&
                  documentsByItem[documentation.name]?.length > 0 && (
                    <View className="gap-4">
                      {documentsByItem[documentation.name]?.map((doc) => (
                        <Pressable
                          key={doc?.uri ?? ""}
                          className="flex-row items-center justify-between gap-2"
                          onPress={() => setSelectedPdf(doc?.name ?? "")}
                        >
                          <Box className="flex-row gap-2 items-center">
                            <SuccessRounded />
                            <Text className="w-[80%]">
                              {doc?.name?.split("/")?.pop() ?? ""}
                            </Text>
                          </Box>
                          <Pressable
                            onPress={() => {
                              handleRemoveDocument(
                                documentation.name,
                                index,
                                doc?.uri ?? ""
                              );
                              handleDeleteFile(doc, documentation.name);
                            }}
                          >
                            <Icon
                              as={CloseCircleIcon}
                              className="text-typography-500"
                              color={Colors.PRIMARY}
                            />
                          </Pressable>
                        </Pressable>
                      ))}
                    </View>
                  )}
                <Actionsheet
                  isOpen={openActionSheetIndex === index}
                  onClose={handleCloseActionSheet}
                  snapPoints={[25]}
                  key={`actionsheet-${index}`}
                >
                  <ActionsheetBackdrop />
                  <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                      <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <HStack className="flex-1 justify-center w-full m-auto px-6 py-4 gap-6">
                      <Pressable
                        className="flex-1 h-auto justify-center items-center gap-3"
                        onPress={() =>
                          handleActionSheetSelection(
                            "image",
                            index,
                            documentation.name
                          )
                        }
                      >
                        <Text className="text-lg font-semibold text-center text-gray-700">
                          {t("gallery", { ns: "utils" })}
                        </Text>
                        <Gallery
                          color={Colors.PRIMARY}
                          width={35}
                          height={35}
                        />
                      </Pressable>
                      <Pressable
                        className="flex-1 h-auto justify-center items-center gap-3"
                        onPress={() =>
                          handleActionSheetSelection(
                            "document",
                            index,
                            documentation.name
                          )
                        }
                      >
                        <Text className="text-lg font-semibold text-center text-gray-700">
                          {t("document", { ns: "utils" })}
                        </Text>
                        <Documents
                          color={Colors.PRIMARY}
                          width={35}
                          height={35}
                        />
                      </Pressable>
                    </HStack>
                  </ActionsheetContent>
                </Actionsheet>
              </Box>
            ))}
          </VStack>
          <Button onPress={() => handleSubmitDocuments()}>
            {loading ? (
              <ActivityIndicator color={Colors.WHITE} />
            ) : (
              t("profile.personal_data.button", { ns: "profile" })
            )}
          </Button>
        </Box>
      </Container>
      <Actionsheet
        isOpen={selectedPdf !== "" && selectedPdf.startsWith("http")}
        onClose={handleClosePdfActionSheet}
        snapPoints={[75]}
        key={`actionsheet`}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <HStack className="flex-1 justify-center w-full m-auto px-6 py-4 gap-6">
            <WebView source={{ uri: selectedPdf }} className="flex-1" />
          </HStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 28,
  },
  mark_map: {
    color: Colors.PRIMARY,
  },
  button: {
    marginTop: 32,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageWrapper: {
    paddingHorizontal: 5,
  },
  image: {
    height: 120,
    borderRadius: 8,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: Colors.LIGHT_GRAY,
    width: 16,
    height: 16,
    borderRadius: 15,
  },
});
