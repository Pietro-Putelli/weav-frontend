import React, { memo } from "react";
import { useTheme } from "../../hooks";
import { BORDER_RADIUS, BUTTON_HEIGHT } from "../../styles/sizes";
import { triggerHaptic } from "../../utility/haptics";
import { MainText } from "../texts";
import { BounceView, LoaderView } from "../views";

const TitleButton = ({
  style,
  textStyle,
  title,
  disabled,
  loading,
  haptic,
  hairline,
  onPress,
  titleProps,
  ...props
}) => {
  const theme = useTheme();

  const color =
    !disabled || disabled == undefined
      ? theme.white_alpha(0.8)
      : theme.white_alpha(0.4);

  const borderStyle =
    hairline == undefined
      ? {}
      : {
          borderColor: theme.white_alpha(0.4),
          borderWidth: 0.8,
          borderRadius: BORDER_RADIUS,
        };

  const _onPress = () => {
    if (haptic) {
      triggerHaptic();
    }
    onPress();
  };

  return (
    <BounceView
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          height: BUTTON_HEIGHT,
        },
        borderStyle,
        style,
      ]}
      activeScale={0.95}
      onPress={_onPress}
      disabled={disabled}
      {...props}
    >
      {loading == undefined || !loading ? (
        <MainText
          font="subtitle"
          align="center"
          style={textStyle}
          {...titleProps}
        >
          {title}
        </MainText>
      ) : (
        <LoaderView percentage={0.7} />
      )}
    </BounceView>
  );
};
export default memo(TitleButton);
