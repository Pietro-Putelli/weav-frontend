import { MotiView } from "moti";
import React, { memo, useMemo } from "react";
import { useTheme } from "../../hooks";
import { ICON_SIZES } from "../../styles/sizes";
import { triggerHaptic } from "../../utility/haptics";
import { SquareImage } from "../images";
import BounceView from "../views/BounceView";

const SolidIconButton = ({
  icon,
  style,
  inset = 0,
  side = ICON_SIZES.two,
  selected,
  states,
  onPress,
  noPadding,
}) => {
  const theme = useTheme();

  const _side = side - 2 * inset;

  const _onPress = () => {
    onPress?.();

    triggerHaptic();
  };

  const renderIcon = ({ icon, color }) => {
    return (
      <SquareImage
        side={_side}
        source={icon}
        color={color ?? theme.white_alpha(0.6)}
      />
    );
  };

  const containerStyle = useMemo(() => {
    let _style = {};

    if (!noPadding) {
      _style = {
        paddingHorizontal: 12,
        padding: 8,
      };
    }

    return [
      {
        alignItems: "center",
        justifyContent: "center",
      },
      theme.styles.shadow_round,
      style,
    ];
  }, [noPadding]);

  return (
    <BounceView onPress={_onPress} style={containerStyle}>
      {!states ? (
        renderIcon({ icon })
      ) : (
        <>
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: selected ? 1 : 0 }}
            transition={{ type: selected ? "spring" : "timing" }}
          >
            {renderIcon(states[0])}
          </MotiView>
          <MotiView
            from={{ scale: 0 }}
            style={{ position: "absolute" }}
            animate={{ scale: selected ? 0 : 1 }}
            transition={{ type: !selected ? "spring" : "timing" }}
          >
            {renderIcon(states[1])}
          </MotiView>
        </>
      )}
    </BounceView>
  );
};
export default memo(SolidIconButton);
