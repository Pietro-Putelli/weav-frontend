import { isUndefined } from "lodash";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks";
import { BORDER_RADIUS, getEventCellSize } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { BounceView } from "../views";
import CacheableImageView from "./CacheableImageView";

const EventCoverPreview = ({
  event,
  children,
  onPress,
  scale,
  ignoreRatio,
  disabledAnimation,
  ...props
}) => {
  let { ratio, cover } = event;

  const theme = useTheme();

  const coverContainerStyle = useMemo(() => {
    if (ignoreRatio) {
      ratio = 1;
    } else {
      if (!ratio) {
        const coverHeight = cover?.height;
        const coverWidth = cover?.width;

        if (!coverHeight || !coverWidth) {
          ratio = 1;
        } else {
          ratio = (coverHeight / coverWidth).toFixed(2);
        }
      }
    }

    return {
      ...getEventCellSize({
        ratio,
        scale: scale ? scale : ratio <= 1 ? 0.94 : 0.8,
      }),
      overflow: "hidden",
      borderRadius: BORDER_RADIUS,
    };
  }, [event]);

  const source = useMemo(() => {
    return cover?.uri ?? cover;
  }, [cover]);

  return (
    <FadeAnimatedView
      disabled={disabledAnimation}
      style={theme.styles.shadow_round}
    >
      <BounceView
        onPress={onPress}
        disabledWithoutOpacity={isUndefined(onPress)}
        {...props}
        style={coverContainerStyle}
      >
        <CacheableImageView
          source={source}
          style={StyleSheet.absoluteFillObject}
        />

        {children}
      </BounceView>
    </FadeAnimatedView>
  );
};

export default EventCoverPreview;
