import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import BadgeMessageCount from "../chat/BadgeMessageCount";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const ICON_SIDE = ICON_SIZES.two;
const CHEVRON = ICON_SIZES.chevron_right;

const SingleTitleCell = ({
  title,
  icon,
  index,
  style,
  iconStyle,
  textStyle,
  noSegue,
  badgeCount,
  coloredIcon,
  onPress,
  disabled,
}) => {
  const theme = useTheme();

  let _onPress;

  if (!index) _onPress = onPress;
  else _onPress = () => onPress(index);

  const badgeExists = badgeCount != undefined && badgeCount != 0;

  return (
    <BounceView
      disabled={disabled}
      style={[styles.container, theme.styles.shadow_round, style]}
      onPress={_onPress}
      activeScale={0.96}
    >
      {icon && (
        <SquareImage
          side={ICON_SIDE}
          coloredIcon={coloredIcon}
          style={{ ...styles.icon, ...iconStyle }}
          source={icon}
        />
      )}
      <MainText
        numberOfLines={2}
        font="subtitle-2"
        color={theme.colors.subtitle}
        style={[
          styles.title,
          textStyle,
          {
            textTransform: textStyle ? "none" : "uppercase",
            marginBottom: 1.5,
          },
        ]}
      >
        {title}
      </MainText>

      {badgeExists && <BadgeMessageCount count={badgeCount} />}

      {!noSegue && (
        <SquareImage
          side={CHEVRON}
          color={theme.white_alpha(0.3)}
          source={icons.Chevrons.Right}
        />
      )}
    </BounceView>
  );
};
export default SingleTitleCell;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: "3%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    letterSpacing: 1.5,
    marginRight: "6%",
    marginLeft: "2%",
  },
  icon: {
    marginRight: "2%",
    resizeMode: "contain",
  },
});
