import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useEventActivity, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { CURRENT_EVENT_VIEW_HEIGHT, TAB_BAR_HEIGHT } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView, LiveDot } from "../views";

const HIDDEN_Y = RFPercentage(12);
const SHOWN_Y = -(TAB_BAR_HEIGHT + CURRENT_EVENT_VIEW_HEIGHT + 12);

const CurrentEventView = ({ onPress }) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const { hasOngoingEvent, event } = useEventActivity();

  useEffect(() => {
    if (hasOngoingEvent) {
      setVisible(true);
    } else {
      setTimeout(() => {
        setVisible(false);
      }, 1000);
    }
  }, [hasOngoingEvent]);

  if (!visible) return null;

  return (
    <MotiView
      from={{ translateY: HIDDEN_Y }}
      animate={{
        translateY: hasOngoingEvent ? SHOWN_Y : HIDDEN_Y,
      }}
      transition={{ damping: 14 }}
      style={{
        width: "100%",
        position: "absolute",
        alignItems: "center",
      }}
    >
      <BounceView
        haptic
        onPress={onPress}
        style={[
          theme.styles.shadow_round,
          {
            flexDirection: "row",
            alignItems: "center",
            height: CURRENT_EVENT_VIEW_HEIGHT,
            paddingHorizontal: 20,
            borderRadius: 20,
            maxWidth: "80%",
          },
        ]}
      >
        <LiveDot hideLabel />

        <View
          style={{
            flexShrink: 1,
            marginHorizontal: 12,
          }}
        >
          <MainText numberOfLines={1} font="subtitle-1" bold>
            {event?.title}
          </MainText>
        </View>

        <SquareImage side={18} source={icons.Chevrons.Up} />
      </BounceView>
    </MotiView>
  );
};

export default CurrentEventView;
