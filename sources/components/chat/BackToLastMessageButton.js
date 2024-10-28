import { MotiView } from "moti";
import React, { memo } from "react";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { IconButton } from "../buttons";

const BackToLastMessageButton = ({ onPress, visible }) => {
  const theme = useTheme();

  return (
    <MotiView
      from={{ translateX: 0 }}
      style={[
        theme.styles.shadow_round,
        {
          right: "2%",
          alignSelf: "flex-end",
          overflow: "hidden",
          position: "absolute",
          bottom: "105%",
          padding: 10,
          borderRadius: 20,
        },
      ]}
      animate={{ translateX: visible ? 0 : 100 }}
    >
      <IconButton
        haptic
        inset={3}
        onPress={onPress}
        source={icons.Chevrons.Down}
      />
    </MotiView>
  );
};

export default memo(BackToLastMessageButton);
