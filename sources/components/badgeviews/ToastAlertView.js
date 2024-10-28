import { MotiView } from "moti";
import React, { memo, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useTheme } from "../../hooks";
import { icons, insets } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { triggerHaptic } from "../../utility/haptics";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const TRANSLATE_Y = RFPercentage(15);

const ToastAlertView = ({
  visible,
  setVisible,
  hideIcon,
  isTop,
  icon,
  children,
  onDismiss,
  hapticDisabled,
}) => {
  const theme = useTheme();

  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (visible) {
      setExists(true);

      if (!hapticDisabled) {
        triggerHaptic();
      }

      setTimeout(() => {
        setVisible?.(false);

        onDismiss?.();
      }, 2000);
    } else {
      setTimeout(() => {
        setExists(false);
      }, 500);
    }
  }, [visible]);

  const containerStyle = useMemo(() => {
    if (isTop) {
      return { top: insets.top };
    }

    return {
      bottom: insets.bottom,
    };
  }, [isTop]);

  const translateY = isTop ? -TRANSLATE_Y : TRANSLATE_Y;

  if (!exists) {
    return null;
  }

  return (
    <MotiView
      from={{ translateY }}
      animate={{ translateY: visible ? 0 : translateY }}
      style={[theme.styles.shadow_round, containerStyle, styles.container]}
    >
      {!hideIcon && (
        <SquareImage
          side={ICON_SIZES.two}
          source={icon ?? icons.ColoredWarning}
          coloredIcon
          style={{ marginRight: 16 }}
        />
      )}
      <MainText
        font="subtitle-1"
        numberOfLines={2}
        style={{ flex: !hideIcon ? 1 : 0 }}
      >
        {children}
      </MainText>
    </MotiView>
  );
};

export default memo(ToastAlertView);

const styles = StyleSheet.create({
  container: {
    width: "96%",
    padding: "4%",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
  },
});
