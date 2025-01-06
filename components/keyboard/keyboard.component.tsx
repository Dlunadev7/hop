import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { KeyboardContainerProps } from "./keyboard.type";
import styles from "./style.ts";

export const KeyboardContainer = (props: KeyboardContainerProps) => {
  const {
    children,
    keyboardShouldPersistTaps = "handled",
    extraScrollHeight = 0,
    enableOnAndroid = false,
    extraHeight = 0,
  } = props;

  return (
    <KeyboardAwareScrollView
      style={styles.keyboard_scrollView}
      contentContainerStyle={styles.keyboard_container}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      extraHeight={extraHeight}
      extraScrollHeight={extraScrollHeight}
      enableOnAndroid={enableOnAndroid}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};
