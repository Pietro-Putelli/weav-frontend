import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks";
import { icons, typographies } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView, PurpleDot } from "../views";

const DoubleTitleCell = ({
  title,
  subtitle,
  icon,
  subtitleStyle,
  style,
  noSegue,
  onPress,
  showDot,
}) => {
  const theme = useTheme();

  const titleStyle = subtitle
    ? {
        textTransform: "uppercase",
        fontSize: typographies.fontSizes.subtitle4,
        fontWeight: "600",
        color: theme.white_alpha(0.5),
      }
    : {
        fontSize: typographies.fontSizes.subtitle4,
        fontWeight: "600",
        color: theme.white_alpha(0.5),
      };

  return (
    <BounceView
      style={[styles.container, theme.styles.shadow_round, style]}
      onPress={onPress}
      activeScale={0.95}
    >
      {icon && <SquareImage source={icon} side={ICON_SIZES.two} />}
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <MainText bold style={[styles.title, titleStyle]}>
            {title}
          </MainText>
          {subtitle != "" && subtitle != null && (
            <MainText
              font="subtitle-1"
              numberOfLines={2}
              style={[styles.subtitle, subtitleStyle]}
            >
              {subtitle}
            </MainText>
          )}
        </View>

        {showDot && <PurpleDot side={10} style={{ marginRight: 8 }} />}

        {!noSegue && (
          <SquareImage
            style={styles.segue}
            side={ICON_SIZES.chevron_right}
            color={theme.white_alpha(0.3)}
            source={icons.Chevrons.Right}
          />
        )}
      </View>
    </BounceView>
  );
};

export default DoubleTitleCell;

const styles = StyleSheet.create({
  container: {
    padding: "4%",
    marginTop: "3%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtitle: {
    marginTop: "3%",
    paddingHorizontal: "3%",
  },
  title: {
    marginLeft: "2%",
    textTransform: "uppercase",
  },
});
