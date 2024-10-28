import { MotiView } from "moti";
import React, { memo, useEffect, useState } from "react";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { BORDER_RADIUS, BUTTON_HEIGHT, ICON_SIZES } from "../../styles/sizes";
import { triggerHapticOnce } from "../../utility/haptics";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const ConfirmButton = ({
  icon,
  title,
  style,
  onPress,
  successTitle,
  ...props
}) => {
  const theme = useTheme();

  const [successful, setSuccessful] = useState();

  useEffect(() => {
    if (successful == true) {
      triggerHapticOnce();
      setTimeout(() => {
        setSuccessful(false);
      }, 1000);
    }
  }, [successful]);

  const _onPress = () => {
    onPress();

    setTimeout(() => {
      setSuccessful(true);
    }, 500);
  };

  return (
    <BounceView
      disabledWithoutOpacity={successful}
      style={[
        theme.styles.shadow_round,
        {
          overflow: "hidden",
          height: BUTTON_HEIGHT,
          alignItems: "center",
          paddingHorizontal: "4%",
          justifyContent: "center",
          borderRadius: BORDER_RADIUS * 1.3,
        },
        style,
      ]}
      activeScale={0.95}
      onPress={_onPress}
      {...props}
    >
      <MotiView
        animate={{
          flexDirection: "row",
          alignItems: "center",
          opacity: successful ? 0 : 1,
        }}
      >
        {icon && <SquareImage source={icon} side={ICON_SIZES.three} />}

        <MainText
          bold
          uppercase
          align="center"
          font="subtitle-1"
          style={{ letterSpacing: 2, marginLeft: "4%" }}
        >
          {title}
        </MainText>
      </MotiView>

      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: successful ? 1 : 0 }}
        transition={{ type: "timing" }}
        style={{
          position: "absolute",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SquareImage
          style={{ marginRight: 8 }}
          side={ICON_SIZES.three}
          source={icons.CircleCheck}
          color={theme.colors.main_accent}
        />
        <MainText uppercase font="subtitle-1" bold>
          sent
        </MainText>
      </MotiView>
    </BounceView>
  );
};
export default memo(ConfirmButton);
