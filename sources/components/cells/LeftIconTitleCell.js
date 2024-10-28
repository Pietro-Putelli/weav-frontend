import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";

import { BounceView } from "../views";

const ACTIVE_SCALE = 0.95;
const ITEM_ICON_SIDE = ICON_SIZES.four;

const LeftIconTitleCell = ({
  item: { title, icon, toScreen, badge },
  noSegue,
  onPress,
  style,
  coloredIcon,
}) => {
  const theme = useTheme();

  return (
    <BounceView
      style={[styles.container, theme.styles.shadow_round, style]}
      activeScale={ACTIVE_SCALE}
      disabledWithoutOpacity={noSegue}
      onPress={() => onPress(toScreen)}
    >
      <SquareImage
        source={icon}
        side={ITEM_ICON_SIDE}
        style={styles.itemIcon}
        coloredIcon={coloredIcon}
      />
      <MainText font="subtitle" style={styles.itemTitle}>
        {title}
      </MainText>

      {badge && (
        <View
          style={[styles.badge, { backgroundColor: theme.colors.main_accent }]}
        >
          <MainText font="subtitle" bold>
            {badge}
          </MainText>
        </View>
      )}
      {!noSegue && (
        <SquareImage
          source={icons.Chevrons.Right}
          side={ICON_SIZES.chevron_right}
        />
      )}
    </BounceView>
  );
};

export default LeftIconTitleCell;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginBottom: "4%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "6%",
  },
  itemTitle: {
    flex: 1,
    marginLeft: 16,
  },
  badge: {
    marginRight: 8,
    borderRadius: 8,
    width: ITEM_ICON_SIDE,
    height: ITEM_ICON_SIDE,
    alignItems: "center",
    justifyContent: "center",
  },
});
