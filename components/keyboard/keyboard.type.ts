export type KeyboardContainerProps = {
  children: React.ReactNode;
  behavior?: 'padding' | 'height' | 'position';
  style?: object;
  keyboardShouldPersistTaps?: 'always' | 'handled' | 'never';
  extraScrollHeight?: number;
  enableOnAndroid?: boolean;
  extraHeight?: number;
}
