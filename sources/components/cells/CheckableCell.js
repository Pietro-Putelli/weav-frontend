import { isUndefined } from "lodash";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { ICON_SIZES } from "../../styles/sizes";
import { CheckmarkButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const CheckableCell = ({
  item,
  title,
  subtitle,
  icon,
  disabled,
  selected,
  textStyle,
  style,
  noMarginTop,
  onPress,
  noColored,
}) => {
  const theme = useTheme();
  const content = subtitle ?? item?.subtitle ?? item?.content;

  return (
    <BounceView
      style={[
        styles.cell,
        theme.styles.shadow_round,
        { marginTop: noMarginTop ? 0 : "4%" },
        style,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        {icon && (
          <View style={{ marginRight: "4%" }}>
            <SquareImage
              source={icon}
              coloredIcon={!noColored}
              side={ICON_SIZES.two}
            />
          </View>
        )}
        <MainText font="subtitle-3" style={[styles.title, textStyle]}>
          {item?.title || item?.name || title}
        </MainText>
        <CheckmarkButton
          selected={item?.selected || selected}
          side={ICON_SIZES.two * 0.9}
        />
      </View>
      {!isUndefined(content) && (
        <MainText
          font="subtitle-3"
          style={styles.subtitle}
          color={theme.white_alpha(0.6)}
        >
          {content}
        </MainText>
      )}
    </BounceView>
  );
};
export default CheckableCell;

const styles = StyleSheet.create({
  cell: {
    padding: 16,
  },
  title: {
    flex: 1,
    marginRight: "4%",
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: "2%",
    marginLeft: "1%",
    marginRight: "10%",
  },
});
