import { useState, useCallback } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

interface DocumentInfo {
  itemId: number;
  uri: string;
  name: string;
  size?: number;
  type?: string;
  folder?: string;
}

export const useFilePicker = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentInfo[]>(
    []
  );
  const [selectedImages, setSelectedImages] = useState<DocumentInfo[]>([]);
  const [documentNames, setDocumentNames] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pickDocument = useCallback(
    async (
      itemId: number,
      allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
      ],
      multipleSelect = false,
      name: string
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await DocumentPicker.getDocumentAsync({
          type: allowedTypes,
          copyToCacheDirectory: true,
          multiple: multipleSelect,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const newDocuments = result.assets.map((asset) => ({
            itemId,
            uri: asset.uri,
            name: asset.name,
            size: asset.size,
            type: asset.mimeType,
            folder: name,
          }));

          setSelectedDocuments((prevDocuments) => {
            const filteredDocuments = newDocuments.filter(
              (newDoc) =>
                !prevDocuments.some(
                  (doc) =>
                    doc.uri === newDoc.uri &&
                    doc.itemId === newDoc.itemId &&
                    doc.name === newDoc.name
                )
            );
            return [...prevDocuments, ...filteredDocuments];
          });

          setDocumentNames((prevNames) => {
            const newNames = newDocuments
              .filter(
                (newDoc) =>
                  !selectedDocuments.some(
                    (doc) =>
                      doc.uri === newDoc.uri &&
                      doc.itemId === newDoc.itemId &&
                      doc.name === newDoc.name
                  )
              )
              .map((doc) => doc.name)
              .join(", ");
            return prevNames ? `${prevNames}, ${newNames}` : newNames;
          });
        } else {
          setError("La selección de documentos fue cancelada.");
        }
      } catch (err: any) {
        setError(
          err.message || "Ocurrió un error al seleccionar el documento."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Función para seleccionar imágenes
  const pickImage = useCallback(
    async (itemId: number, isMultiple: boolean = true) => {
      try {
        setIsLoading(true);
        setError(null);

        const result: any = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 1,
        });

        if (!result.canceled) {
          const resultImage = result.assets[0];
          const newDocument = {
            itemId,
            uri: resultImage.uri,
            name: resultImage.uri.split("/").pop() ?? "image.png",
            size: resultImage.expoSize,
            type: "image/png",
          };

          setSelectedImages((prevImages) => {
            if (isMultiple) {
              // Acumular imágenes si no existen previamente
              const alreadyExists = prevImages.some(
                (doc) =>
                  doc.uri === newDocument.uri &&
                  doc.itemId === newDocument.itemId &&
                  doc.name === newDocument.name
              );
              return alreadyExists ? prevImages : [...prevImages, newDocument];
            }
            // Reemplazar imágenes
            return [newDocument];
          });

          setDocumentNames(() => {
            if (isMultiple) {
              const alreadyExists = selectedDocuments.some(
                (doc) => doc.name === newDocument.name
              );
              return alreadyExists
                ? documentNames
                : documentNames
                ? `${documentNames}, ${newDocument.name}`
                : newDocument.name;
            }
            return newDocument.name; // Reemplazar nombre
          });
        } else {
          setError("La selección de imagen fue cancelada.");
        }
      } catch (err: any) {
        setError(err.message || "Ocurrió un error al seleccionar la imagen.");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedDocuments, documentNames]
  );

  const removeDocument = useCallback(
    (itemId: number, documentToRemove: DocumentInfo) => {
      setSelectedDocuments((prevDocuments) =>
        prevDocuments.filter(
          (doc) => doc.uri !== documentToRemove.uri || doc.itemId !== itemId
        )
      );

      setDocumentNames((prevNames) => {
        const updatedNames = prevNames
          .split(",")
          .filter((name) => name.trim() !== documentToRemove.name)
          .join(", ")
          .replace(/,\s*$/, "");
        return updatedNames;
      });
    },
    []
  );

  const removeImage = useCallback(
    (itemId: number, documentToRemove: DocumentInfo) => {
      setSelectedImages((prevDocuments) =>
        prevDocuments.filter(
          (doc) => doc.uri !== documentToRemove.uri || doc.itemId !== itemId
        )
      );
    },
    []
  );

  const resetDocuments = useCallback(() => {
    setSelectedDocuments([]);
    setDocumentNames("");
    setError(null);
  }, []);

  return {
    selectedDocuments,
    selectedImages,
    documentNames,
    error,
    isLoading,
    pickDocument,
    pickImage,
    removeImage,
    removeDocument,
    resetDocuments,
  };
};
