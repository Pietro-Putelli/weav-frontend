import { capitalize } from "lodash";
import React, { forwardRef, memo, useMemo } from "react";
import { Dimensions, StyleSheet, TextInput } from "react-native";
import { useLanguages, useTheme } from "../../hooks";
import { fonts, typographies } from "../../styles";

const { height } = Dimensions.get("window");
const INPUT_MAX_HEIGHT = height / 6;

const MessageTextInput = forwardRef(({ isEnabled, style, ...props }, ref) => {
  const theme = useTheme();

  const { languageContent } = useLanguages();

  const placeholder = useMemo(() => {
    return isEnabled
      ? capitalize(languageContent.message) + "..."
      : languageContent.wait_receiver;
  }, [isEnabled]);

  const inputStyle = useMemo(() => {
    return [
      {
        fontSize: typographies.fontSizes.subtitle1,
        fontFamily: fonts.Medium,
        paddingTop: 0,
        letterSpacing: 1.2,
        bottom: 1,
      },
      styles.input,
      style,
    ];
  }, [style]);

  return (
    <TextInput
      multiline
      ref={ref}
      maxLength={256}
      style={inputStyle}
      editable={isEnabled}
      placeholder={placeholder}
      keyboardAppearance="dark"
      selectionColor={theme.colors.main_accent}
      placeholderTextColor={theme.colors.placeholderText}
      {...props}
    />
  );
});

export default memo(MessageTextInput);

const styles = StyleSheet.create({
  input: {
    flex: 1,
    color: "white",
    marginRight: "12%",
    maxHeight: INPUT_MAX_HEIGHT,
    paddingTop: 0,
    paddingVertical: 0,
    paddingBottom: 0,
    includeFontPadding: false,
  },
});
