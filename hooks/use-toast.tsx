import { useState } from "react";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast as useGlueToast,
} from "@/components/ui/toast";
import { ToastPlacement } from "@gluestack-ui/toast/lib/types";
import { HStack } from "@/components/ui/hstack";
import { CloseCircleIcon, Icon } from "@/components/ui/icon";
import { WarningToast } from "@/assets/svg";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/text/text.component";
import { Colors } from "@/constants/Colors";
import { Pressable, StyleSheet } from "react-native";

export const useToast = () => {
  const [toastId, setToastId] = useState<number | null>(null);
  const toast = useGlueToast();
  const showToast = ({
    message,
    action = "error",
    duration = 3000,
    placement = "bottom",
  }: {
    message: string;
    action?: "error" | "muted" | "warning" | "success" | "info" | undefined;
    duration?: number;
    placement?: ToastPlacement;
  }) => {
    const newId = Math.random();
    setToastId(newId);

    toast.show({
      id: String(newId),
      placement,
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast
            action={action}
            variant="solid"
            nativeID={uniqueToastId}
            className="p-4 gap-6 flex-auto border-error-500 w-[98%] rounded-xl shadow-hard-5 flex-row justify-between"
          >
            <HStack space="md" className="items-center flex-wrap">
              <Icon as={WarningToast} className="h-8 w-8" />
              <VStack space="xs" style={styles.toast_container}>
                <Text
                  textColor={Colors.WHITE_SECONDARY}
                  fontSize={16}
                  fontWeight={400}
                >
                  {message}
                </Text>
              </VStack>
            </HStack>
            <HStack className="gap-1">
              <Pressable onPress={() => toast.close(id)}>
                <Icon as={CloseCircleIcon} color={Colors.WHITE_SECONDARY} />
              </Pressable>
            </HStack>
          </Toast>
        );
      },
    });
  };

  return { showToast, toastId };
};

const styles = StyleSheet.create({
  toast_container: {
    maxWidth: "80%",
  },
});
