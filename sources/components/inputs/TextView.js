import React, { forwardRef, memo, useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "../../hooks";
import { fonts, icons, typographies } from "../../styles";
import { IconButton } from "../buttons";
import { FadeView } from "../views";

const TextView = forwardRef((props, ref) => {
  const {
    style,
    maxNumberOfLines,
    textStyle,
    height,
    solid,
    clearButton,
    onChangeText,
    onChangeTextStatus,
    onFocus,
    ...otherProps
  } = props;

  const theme = useTheme();

  const [isEditing, setIsEditing] = useState();

  const paddingBottom = clearButton ? 32 : 0;

  const textInputStyle = useMemo(() => {
    if (solid) {
      return {
        ...theme.styles.shadow_round,
        padding: "4%",
      };
    }
    return {};
  });

  const _onChangeText = (text) => {
    if (!maxNumberOfLines) {
      onChangeText(text);
    } else {
      const newLinesCount = text.match(/\n/g)?.length ?? 0;
      if (newLinesCount < maxNumberOfLines) {
        onChangeText(text);
      }
    }
  };

  return (
    <View style={[textInputStyle, style]}>
      <TextInput
        multiline
        ref={ref}
        selectionColor={theme.colors.main_accent}
        style={{
          height,
          ...styles.text,
          fontSize: typographies.fontSizes.subtitle,
          color: "white",
          fontFamily: fonts.Medium,
          paddingBottom,
          paddingTop: 0,
          ...textStyle,
        }}
        placeholderTextColor={theme.white_alpha(0.1)}
        keyboardAppearance="dark"
        onChangeText={_onChangeText}
        onFocus={() => {
          onFocus?.();
          setIsEditing(true);
          onChangeTextStatus?.(true);
        }}
        onBlur={() => {
          setIsEditing(false);
          onChangeTextStatus?.(false);
        }}
        {...otherProps}
      />

      {clearButton && (
        <FadeView hidden={!isEditing} style={[styles.clear]}>
          <IconButton
            haptic
            onPress={() => {
              onChangeText("");
            }}
            color={theme.white_alpha(0.5)}
            source={icons.Rubber}
            disabled={!isEditing}
          />
        </FadeView>
      )}
    </View>
  );
});
export default memo(TextView);

const styles = StyleSheet.create({
  text: {
    paddingBottom: 0,
    includeFontPadding: false,
    textAlignVertical: "top",
    letterSpacing: 1.2,
  },
  clear: {
    right: 0,
    bottom: 0,
    padding: "2%",
    position: "absolute",
  },
});
