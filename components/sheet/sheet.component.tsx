import React, { useRef, useEffect, ReactElement, useCallback } from "react";
import { Platform, StyleSheet, View } from "react-native";
import GBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import { Text } from "../text/text.component";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  content: ReactElement | ReactElement[];
  title?: string;
  snapPoints?: (string | number)[];
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  setIsOpen,
  content,
  title,
  snapPoints,
}) => {
  const bottomSheetRef = useRef<GBottomSheet>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (bottomSheetRef.current) {
      if (isOpen) {
        bottomSheetRef.current.expand();
      } else {
        bottomSheetRef.current.close();
      }
    }
  }, [isOpen, setIsOpen]);

  const handleSheetChange = (index: number) => {
    setIsOpen(index > 0);
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        pressBehavior="none"
        enableTouchThrough={true}
      />
    ),
    []
  );

  return (
    <GBottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 1 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      handleComponent={() => (
        <View style={styles.handle}>
          {title && <Text fontWeight={600}>{title}</Text>}
          <View style={styles.drag_line} />
        </View>
      )}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      enablePanDownToClose={false}
    >
      <BottomSheetView
        style={{
          backgroundColor: Colors.WHITE,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom,
        }}
      >
        {content}
      </BottomSheetView>
    </GBottomSheet>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  handle: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.LIGHT_GRAY,
    backgroundColor: Colors.WHITE,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  background: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  drag_line: {
    width: 48,
    height: 2,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 100,
    marginTop: 4,
  },
  backdrop: {
    backgroundColor: "transparent",
  },
});

export default styles;
