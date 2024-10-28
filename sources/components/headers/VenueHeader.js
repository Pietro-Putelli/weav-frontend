import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { gradients } from "../../styles";
import { FadeAnimatedView } from "../animations";
import { CacheableImageView } from "../images";
import { MainText } from "../texts";
import { LinearGradient } from "../views";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.4;

const VenueHeader = ({ business, scrollY, event, children }) => {
  const theme = useTheme();

  const animatedScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1.05, 0.95],
            Extrapolate.CLAMP
          ),
        },
        { translateY: scrollY.value / 2 },
      ],
    };
  }, []);

  const font = useMemo(() => {
    if (business?.name?.length > 20) {
      return "title-4";
    }

    return "title-3";
  }, []);

  const cover = business?.cover_source;

  return (
    <View>
      <View style={styles.headerContainer}>
        <Animated.View style={[animatedScaleStyle, StyleSheet.absoluteFill]}>
          <CacheableImageView
            source={cover?.uri ?? cover}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        <LinearGradient
          inverted
          style={styles.gradient}
          colors={gradients.Profile}
        >
          <FadeAnimatedView mode="fade-up" style={{ marginHorizontal: 4 }}>
            <MainText
              style={{ letterSpacing: 3, lineHeight: RFValue(32) }}
              font={font}
              bold
            >
              {business?.name}
            </MainText>
          </FadeAnimatedView>
        </LinearGradient>
      </View>

      <View style={{ backgroundColor: theme.colors.background }}>
        {children}
      </View>
    </View>
  );
};

export default memo(VenueHeader);

const styles = StyleSheet.create({
  headerContainer: {
    width,
    height: HEADER_HEIGHT,
    justifyContent: "flex-end",
  },
  gradient: {
    paddingTop: HEADER_HEIGHT / 2.5,
    width: "100%",
    position: "absolute",
    bottom: 0,
    marginBottom: 0,
    justifyContent: "flex-end",
    padding: 8,
    paddingLeft: 10,
  },
});
