import { size } from "lodash";
import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { MAX_USER_MOMENT_CHAR_COUNT } from "../../constants/constants";
import { useTheme } from "../../hooks";
import { gradients } from "../../styles";
import { getPictureHeightUsingRatio } from "../../styles/sizes";
import { CacheableImageView } from "../images";
import { LinearGradientView } from "../views";
import ContentView from "./ContentView";

const MediaCell = ({
  moment,
  source,
  children,
  isPreview,
  isChatPreview,
  states,
  ...props
}) => {
  const theme = useTheme();
  const sourceUri = moment?.source ?? source;

  /* Styles */

  const containerStyle = useMemo(() => {
    return {
      overflow: "hidden",
      ...theme.styles.shadow_round,
      height: getPictureHeightUsingRatio(moment.ratio, isChatPreview),
    };
  }, []);

  const colors = useMemo(() => {
    const content = moment.content;
    const contentLength = size(content);

    if (moment.ratio > 1) {
      if (contentLength > MAX_USER_MOMENT_CHAR_COUNT / 3) {
        return gradients.DarkMoment;
      }

      return gradients.LightMoment;
    }

    return gradients.DarkMoment;
  }, [moment]);

  return (
    <Animated.View style={containerStyle}>
      <CacheableImageView
        source={sourceUri}
        style={StyleSheet.absoluteFillObject}
      />

      <LinearGradientView colors={colors} style={styles.overlay}>
        {children}

        <ContentView
          isChatPreview={isChatPreview}
          isPreview={isPreview}
          moment={moment}
          {...props}
        />
      </LinearGradientView>
    </Animated.View>
  );
};

export default memo(MediaCell);

const styles = StyleSheet.create({
  overlay: {
    bottom: 0,
    position: "absolute",
    justifyContent: "flex-end",
    width: "100%",
    height: "100%",
    opacity: 1,
  },
});
