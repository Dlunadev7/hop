import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { VStack } from "@/components/ui/vstack";
import { useTranslation } from "react-i18next";
import { Box } from "@/components/ui/box";
import {
  Documents,
  DocumentUpload,
  Gallery,
  SuccessRounded,
} from "@/assets/svg";
import { Colors } from "@/constants/Colors";
import { Text } from "@/components/text/text.component";
import { RegisterType } from "@/utils/types/register.type";
import { updateUserDocuments } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/button/button.component";
import { useFilePicker } from "@/hooks/use-document-picker.hook";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, CloseCircleIcon, Icon } from "@/components/ui/icon";
import { documentationHopper } from "@/constants/documentation.constants";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import Tooltip from "@/components/tooltip/tooltip.component";
import { useAuth } from "@/context/auth.context";

type formProps = {
  payloadValues: RegisterType;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payload: React.Dispatch<React.SetStateAction<{}>>;
  extraData: string;
  role: string;
};

const { width } = Dimensions.get("window");

export default function Step3Hopper(props: formProps) {
  const { setStep, extraData, payloadValues } = props;
  const { t } = useTranslation();

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
  const [imagesByItem, setImagesByItem] = useState<Record<number, any[]>>({});

  const { token } = useAuth();

  const handleOpenActionSheet = (index: number) => {
    setOpenActionSheetIndex(index);
  };

  const handleCloseActionSheet = () => {
    setOpenActionSheetIndex(null);
  };

  const handleRegisterStep3 = async () => {
    setLoading(true);

    try {
      const requiredFields = {
        "imagesByItem[4]": imagesByItem[4],
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

      const images = imagesByItem[4].map(
        (doc: { uri: string; name: string; type: string }) => ({
          name: doc.name,
          uri: doc.uri,
          type: doc.type,
        })
      );
      const seremiDoc = documentsByItem["seremi"].map(
        (doc: { uri: string; name: string; type: string }) => ({
          name: doc.name,
          uri: doc.uri,
          type: doc.type,
        })
      );
      const driverResume = documentsByItem["curriculum_vitae"].map(
        (doc: { uri: string; name: string; type: string }) => ({
          name: doc.name,
          uri: doc.uri,
          type: doc.type,
        })
      );
      const circulationPermit = documentsByItem["permission"].map(
        (doc: { uri: string; name: string; type: string }) => ({
          name: doc.name,
          uri: doc.uri,
          type: doc.type,
        })
      );
      const passengerInsurance = documentsByItem["secure"].map(
        (doc: { uri: string; name: string; type: string }) => ({
          name: doc.name,
          uri: doc.uri,
          type: doc.type,
        })
      );

      const payload = {
        vehiclePictures: images,
        seremiDecree: seremiDoc,
        driverResume: driverResume,
        circulationPermit: circulationPermit,
        passengerInsurance: passengerInsurance,
      };

      await updateUserDocuments(extraData, payload);
      setStep(4);
    } catch (error) {
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

  const handleRemoveImage = (uri: string, index: number) => {
    setImagesByItem((prev) => {
      const updatedImages = prev[index].filter((image) => image.uri !== uri);
      return {
        ...prev,
        [index]: updatedImages,
      };
    });
    removeImage(index, {
      uri: uri,
      itemId: index,
      name: "",
    });
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
    if (selectedImages.length > 0) {
      setImagesByItem((prev) => {
        const itemId = selectedImages[0]?.itemId;
        const currentImages = prev[itemId] || [];
        const newImages = selectedImages.filter(
          (img) =>
            !currentImages.some((existingImg) => existingImg.uri === img.uri)
        );
        return {
          ...prev,
          [itemId]: [...currentImages, ...newImages],
        };
      });
    }
  }, [selectedImages, selectedDocuments]);

  const imageWidth = (width - 2 * 28) / 3;

  return (
    <Pressable
      style={styles.formulary}
      className="pb-4"
      onPress={() => setShowTooltip(false)}
    >
      <Text fontSize={16} fontWeight={400}>
        {t("signup.step_3.documentation_hopper")}
      </Text>
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
            {imagesByItem[index] && imagesByItem[index].length > 0 && (
              <ScrollView contentContainerStyle={styles.gridContainer}>
                <HStack style={styles.row}>
                  {imagesByItem[index].map((image) => (
                    <View
                      style={[styles.imageWrapper, { width: imageWidth }]}
                      key={image.uri}
                    >
                      <Image
                        className="rounded-lg"
                        source={{ uri: image.uri }}
                        style={[styles.image, { width: imageWidth }]}
                      />

                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => handleRemoveImage(image.uri, index)}
                        className="flex justify-center items-center"
                      >
                        <Icon
                          as={CloseCircleIcon}
                          className="text-typography-500 m-2 w-2 h-2"
                        />
                      </Pressable>
                    </View>
                  ))}
                </HStack>
              </ScrollView>
            )}
            {documentsByItem[documentation.name] &&
              documentsByItem[documentation.name].length > 0 && (
                <View className="gap-4">
                  {documentsByItem[documentation.name].map((doc) => (
                    <View
                      key={doc?.uri ?? ""}
                      className="flex-row items-center justify-between gap-2"
                    >
                      <Box className="flex-row gap-2 items-center">
                        <SuccessRounded />
                        <Text className="w-[80%]">{doc?.name ?? ""}</Text>
                      </Box>
                      <Pressable
                        onPress={() =>
                          handleRemoveDocument(
                            documentation.name,
                            index,
                            doc?.uri ?? ""
                          )
                        }
                      >
                        <Icon
                          as={CloseCircleIcon}
                          className="text-typography-500"
                          color={Colors.PRIMARY}
                        />
                      </Pressable>
                    </View>
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
                    <Gallery color={Colors.PRIMARY} width={35} height={35} />
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
                    <Documents color={Colors.PRIMARY} width={35} height={35} />
                  </Pressable>
                </HStack>
              </ActionsheetContent>
            </Actionsheet>
          </Box>
        ))}
      </VStack>
      <Button onPress={() => handleRegisterStep3()} style={styles.button}>
        {loading ? (
          <ActivityIndicator color={Colors.WHITE} />
        ) : (
          t("signup.step_2.buttons.next")
        )}
      </Button>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  formulary: {
    gap: 16,
    paddingBottom: 120,
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
