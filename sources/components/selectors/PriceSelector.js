import React from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { triggerHapticOnce } from "../../utility/haptics";
import { useMemo } from "react";
import { MainText } from "../texts";

const { width } = Dimensions.get("window");

const ICON_SIDE = ICON_SIZES.one * 1.1;
const SELECTED = icons.Dollar;

const initializeAnimatedValues = (initial) =>
  Array(4)
    .fill(null)
    .map((value, index) => new Animated.Value(index + 1 <= initial ? 1 : 0));

const createAnimations = (config, values, prev, curr) => {
  if (curr > prev) {
    const startIndex = prev === 0 ? 0 : prev - 1;
    return values.slice(startIndex, curr).map((value) =>
      Animated.timing(value, {
        ...config,
        toValue: 1,
        useNativeDriver: true,
      })
    );
  }
  return values
    .slice(curr, prev)
    .map((value) =>
      Animated.timing(value, {
        ...config,
        toValue: 0,
        useNativeDriver: true,
      })
    )
    .reverse();
};

const PriceSelector = ({ style, price, solid, showText, onChange }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const getSelectedOpacity = (index) =>
    animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

  const getUnselectedOpacity = (index) =>
    animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

  const getScale = (index) =>
    animatedValues[index].interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1],
      extrapolate: "clamp",
    });

  const animatedValues = initializeAnimatedValues(price);

  const animate = (curr) => () => {
    triggerHapticOnce();

    const animations = createAnimations(
      { easing: Easing.inOut(Easing.ease), duration: 400 },
      animatedValues,
      price,
      curr
    );

    onChange(curr);
    Animated.stagger(100, animations).start();
  };

  const renderStar = (value, index) => (
    <TouchableWithoutFeedback key={index} onPress={animate(index + 1)}>
      <View
        style={{
          width: ICON_SIDE,
          height: ICON_SIDE,
        }}
      >
        <View style={styles.imageContainer}>
          <Animated.Image
            style={[
              styles.image,
              {
                opacity: getUnselectedOpacity(index),
                transform: [{ scale: getScale(index) }],
                tintColor: "rgba(255,255,255,0.1)",
              },
            ]}
            source={SELECTED}
          />
        </View>
        <View style={styles.imageContainer}>
          <Animated.Image
            style={[
              styles.image,
              {
                opacity: getSelectedOpacity(index),
                transform: [{ scale: getScale(index) }],
                tintColor: "seagreen",
              },
            ]}
            source={SELECTED}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const containerStyle = useMemo(() => {
    const _style = [
      {
        alignItems: "center",
        flexDirection: "row",
        ...style,
      },
    ];

    if (solid) {
      _style.push(theme.styles.shadow_round);
      _style.push({
        paddingHorizontal: "4%",
        justifyContent: "space-between",
        padding: "4%",
      });
    }

    return _style;
  }, [style, solid]);

  return (
    <View style={containerStyle}>
      {showText && (
        <View style={{ flex: 1 }}>
          <MainText font="subtitle-1" capitalize>
            {languageContent.select_price_target}
          </MainText>
        </View>
      )}
      {animatedValues.map(renderStar)}
    </View>
  );
};

export default PriceSelector;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain",
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});
