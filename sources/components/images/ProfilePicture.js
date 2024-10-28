import { MotiView } from "moti";
import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Svg, { Rect } from "react-native-svg";
import { useTheme } from "../../hooks";
import { AnimatedBlurView } from "../animations";
import { BounceView } from "../views";
import CacheableImageView from "./CacheableImageView";

const PROFILE_DEFAULT_SIDE = RFPercentage(11);

const AnimatedCircle = Animated.createAnimatedComponent(Rect);

const ProfilePicture = ({
  source,
  removeOutline,
  style,
  side = PROFILE_DEFAULT_SIDE,
  onPress,
  disabled,
  hasOutline,
  renderPlacehoder,
  isBlur,
  ...props
}) => {
  const theme = useTheme();

  /* Props & Styles */

  const containerStyle = useMemo(() => {
    return [{ width: side, height: side }, styles.container, style];
  }, [style, side]);

  const { strokeWidth, scale, radius, svgSide } = useMemo(() => {
    let strokeWidth = 3;
    let scaleFactor = 0.89;

    if (side < 100) {
      strokeWidth = 2.5;
      scaleFactor = 0.85;
    }

    let scale = RFValue(0.5) * scaleFactor;

    if (!hasOutline) {
      scale = 1;
    }

    return {
      strokeWidth,
      scale,
      radius: side / 2.25,
      svgSide: side - 2 * strokeWidth,
    };
  }, [side, hasOutline]);

  const borderRadius = useMemo(() => {
    return radius * (isBlur ? 1.2 : 1.0);
  }, [radius, isBlur]);

  const contentStyle = useMemo(() => {
    return {
      overflow: "hidden",
      borderRadius,
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.second_background,
    };
  }, [side]);

  const blurOverlayStyle = useMemo(() => {
    return {
      width: side,
      height: side,
      borderRadius,
      overflow: "hidden",
      transform: [{ scale: 1.01 }],
    };
  }, [side]);

  return (
    <BounceView
      disabledWithoutOpacity={disabled}
      style={containerStyle}
      onPress={onPress}
    >
      <MotiView
        from={{ scale: 0 }}
        style={StyleSheet.absoluteFillObject}
        animate={{ scale: hasOutline ? 1 : 0 }}
        transition={{ type: "timing", duration: 500 }}
      >
        <Svg>
          <AnimatedCircle
            x={strokeWidth}
            y={strokeWidth}
            width={svgSide}
            height={svgSide}
            rx={radius}
            strokeWidth={strokeWidth}
            stroke={theme.colors.main_accent}
            fill="transparent"
          />
        </Svg>
      </MotiView>

      <MotiView animate={{ scale }} style={contentStyle}>
        {renderPlacehoder && !source && renderPlacehoder()}

        <CacheableImageView
          style={StyleSheet.absoluteFill}
          source={source}
          {...props}
        />
      </MotiView>

      <AnimatedBlurView
        intensity={70}
        visible={isBlur}
        tint="dark"
        style={blurOverlayStyle}
      />
    </BounceView>
  );
};

export default memo(ProfilePicture);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});
