import { MotiView } from "moti";
import React, { memo, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useTheme } from "../../hooks";
import { insets } from "../../styles";
import { triggerHaptic } from "../../utility/haptics";

const Y = RFPercentage(15);
const HIDDEN_Y = -Y;
const VISIBLE_Y = insets.top;

const BadgeView = ({
  children,
  visible,
  setVisible,
  onDidAnimate,
  style,
  hideAfter = 1000,
  ...props
}) => {
  const { styles } = useTheme();

  useEffect(() => {
    if (visible) {
      triggerHaptic();

      setTimeout(() => {
        setVisible(false);
        onDidAnimate?.();
      }, hideAfter);
    }
  }, [visible]);

  return (
    <MotiView
      from={{ translateY: HIDDEN_Y }}
      animate={{ translateY: visible ? VISIBLE_Y : HIDDEN_Y }}
      transition={{
        duration: 400,
        type: "spring",
      }}
      style={[
        styles.shadow_round,
        {
          position: "absolute",
          paddingHorizontal: "6%",
          height: 50,
          zIndex: 10,
          alignSelf: "center",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </MotiView>
  );
};

export default memo(BadgeView);
