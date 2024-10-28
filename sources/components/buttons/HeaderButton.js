import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { BORDER_RADIUS, HOME_HEADER_HEIGHT } from "../../styles/sizes";
import { BadgeCountView } from "../badgeviews";
import { SquareImage } from "../images";
import { BounceView } from "../views";

const ICON_SIDE = HOME_HEADER_HEIGHT * 0.42;

const HeaderButton = ({ icon, iconSidePercentage = 1, count, onPress }) => {
  const theme = useTheme();

  const containerStyle = useMemo(() => {
    return [theme.styles.shadow_round, styles.container];
  }, []);

  return (
    <View style={containerStyle}>
      {count !== 0 && <BadgeCountView count={count} />}

      <BounceView
        onPress={onPress}
        style={[containerStyle, { height: "100%" }]}
      >
        <SquareImage side={ICON_SIDE * iconSidePercentage} source={icon} />
      </BounceView>
    </View>
  );
};

export default memo(HeaderButton);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: HOME_HEADER_HEIGHT,
    justifyContent: "center",
    borderRadius: BORDER_RADIUS * 1.3,
  },
});
