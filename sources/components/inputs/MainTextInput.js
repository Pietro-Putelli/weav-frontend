import React, { forwardRef, memo, useMemo } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "../../hooks";
import { fonts, typographies } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";

const ICON_SIDE = ICON_SIZES.two;

const MainTextInput = forwardRef(
  (
    {
      font = "subtitle",
      solid,
      style,
      error,
      textStyle,
      icon,
      value,
      onFocus,
      tintColor,
      keyboardType,
      coloredIcon,
      onChangeTextStatus,
      ...otherProps
    },
    ref
  ) => {
    const theme = useTheme();

    const containerStyle = solid
      ? {
          padding: 20,
          ...theme.styles.shadow_round,
        }
      : {};

    const titleStyle = useMemo(() => {
      return {
        fontSize: typographies.fontSizes[font.replace("-", "")],
        color: "white",
        letterSpacing: 1,
        fontFamily: fonts.Medium,
      };
    }, [font]);

    return (
      <View style={[containerStyle, style]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {icon && (
            <SquareImage
              coloredIcon={coloredIcon}
              source={icon}
              side={ICON_SIDE}
              color={tintColor}
              style={{ marginRight: "4%" }}
            />
          )}
          <TextInput
            scrollEnabled={false}
            autoCapitalize={keyboardType == "url" ? "none" : "sentences"}
            ref={ref}
            value={value}
            keyboardType={keyboardType}
            keyboardAppearance={theme.keyboardAppearance}
            style={[styles.textInput, titleStyle, textStyle]}
            clearButtonMode="while-editing"
            placeholderTextColor={theme.colors.placeholderText}
            selectionColor={theme.colors.main_accent}
            onFocus={() => {
              onChangeTextStatus?.(true);
              onFocus?.();
            }}
            onBlur={() => {
              onChangeTextStatus?.(false);
            }}
            {...otherProps}
          />
        </View>
      </View>
    );
  }
);

export default memo(MainTextInput);

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    paddingBottom: 0,
    includeFontPadding: false,
  },
});
