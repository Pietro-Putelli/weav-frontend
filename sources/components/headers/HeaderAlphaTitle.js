import React from "react";
import { Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { icons, insets } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";

import { useNavigation } from "react-native-navigation-hooks/dist";
import { imagesizes } from "../../constants";
import { FadeAnimatedView } from "../animations";
import { IconButton } from "../buttons";
import { MainText } from "../texts";
const { width } = Dimensions.get("window");

const inputRange = [
  imagesizes.BUSINESS_COVER.height * 0.6,
  imagesizes.BUSINESS_COVER.height * 0.8,
];

export default function Header({ scrollY, title, onMorePress, isPreview }) {
  const navigation = useNavigation();

  const opacity = useDerivedValue(() => {
    return interpolate(scrollY.value, inputRange, [0, 1], Extrapolate.CLAMP);
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(9,6,22,${opacity.value})`,
    };
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      bottom: interpolate(
        scrollY.value,
        inputRange,
        [-10, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <FadeAnimatedView
      delay={200}
      mode="fade-up"
      style={[
        {
          width,
          zIndex: 2,
          paddingTop: insets.top,
          position: "absolute",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: "3%",
          paddingRight: "4%",
          paddingBottom: "3%",
        },
        animatedContainerStyle,
      ]}
    >
      <IconButton
        inset={5}
        side={ICON_SIZES.one}
        source={icons.Chevrons["Left"]}
        c
        onPress={() => {
          navigation.pop();
        }}
      />

      <Animated.View
        style={[{ flex: 1, marginHorizontal: "3%" }, titleAnimatedStyle]}
      >
        <MainText
          style={{ marginBottom: 6 }}
          font="title-7"
          align="center"
          numberOfLines={1}
        >
          {title}
        </MainText>
      </Animated.View>

      <IconButton
        inset={4}
        source={icons.More}
        onPress={onMorePress}
        side={ICON_SIZES.one}
        disabledWithoutOpacity={isPreview}
      />
    </FadeAnimatedView>
  );
}
