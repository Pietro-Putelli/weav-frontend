import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { icons, insets } from "../../styles";
import { AnimatedBottomContainer } from "../animations";
import { SolidButton } from "../buttons";

const VenueBottomView = ({
  showSpots,
  showReserve,
  onSpotsPress,
  onReservePress,
}) => {
  const theme = useTheme();

  const containerStyle = useMemo(() => {
    return [theme.styles.shadow_round_second, styles.container];
  }, []);

  if (!showSpots && !showReserve) {
    return null;
  }

  return (
    <AnimatedBottomContainer isVisible style={containerStyle}>
      <View style={{ flex: 1, marginRight: 8 }}>
        {showSpots && (
          <SolidButton
            type="done"
            title="moments"
            icon={icons.Play}
            onPress={onSpotsPress}
          />
        )}
      </View>

      <View style={{ flex: 1 }}>
        {showReserve && (
          <SolidButton haptic title="reserve" onPress={onReservePress} />
        )}
      </View>
    </AnimatedBottomContainer>
  );
};

export default VenueBottomView;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 8,
    zIndex: 10,
    bottom: -1,
    width: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 0,
    paddingBottom: insets.bottom + 4,
    borderTopColor: "rgba(255,255,255,0.1)",
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(9,6,22,0.96)",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftTitle: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
});
