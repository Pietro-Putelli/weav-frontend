import { isUndefined } from "lodash";
import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SCREENS } from "../../constants/screens";
import { useTheme } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const ICON_SIDE = ICON_SIZES.two * 0.9;

const InsightIconCell = ({
  icon,
  title,
  type,
  overview,
  contentKey,
  componentId,
}) => {
  const theme = useTheme();

  const deltaPercentage = overview?.[contentKey]?.toFixed(0);

  const { sign, color } = useMemo(() => {
    const postiveDelta = deltaPercentage >= 0;

    if (deltaPercentage == 0) {
      return { sign: "", color: theme.colors.text };
    }

    return {
      color: postiveDelta ? theme.colors.green : theme.colors.red,
      sign: postiveDelta ? "+" : "",
    };
  }, [deltaPercentage]);

  const onPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.BusinessInsightDetail,
      passProps: { title, type, icon },
    });
  };

  return (
    <BounceView
      style={[styles.container, theme.styles.shadow_round]}
      onPress={onPress}
    >
      {icon && (
        <SquareImage
          side={ICON_SIDE}
          color={theme.colors.text}
          style={styles.icon}
          source={icon}
        />
      )}
      <MainText
        numberOfLines={2}
        font="subtitle-1"
        capitalize
        color={theme.colors.subtitle}
        style={styles.title}
      >
        {title}
      </MainText>

      {!isUndefined(deltaPercentage) && (
        <MainText
          bold
          color={color}
          font="subtitle-1"
          style={{ marginRight: "4%" }}
        >
          {sign}
          {deltaPercentage}%
        </MainText>
      )}

      <SquareImage
        side={ICON_SIZES.chevron_right}
        color={theme.white_alpha(0.3)}
        source={icons.Chevrons.Right}
      />
    </BounceView>
  );
};

export default memo(InsightIconCell);

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
    letterSpacing: 1,
    marginRight: "6%",
    marginLeft: "2%",
  },
  icon: {
    marginRight: "2%",
    resizeMode: "contain",
  },
});
