import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { icons, insets } from "../../styles";
import { ICON_SIZES, NAVIGATION_BAR_HEIGHT } from "../../styles/sizes";
import { capitalizeFirstLetter } from "../../utility/strings";
import { FadeAnimatedView } from "../animations";
import { IconButton } from "../buttons";
import { MainText } from "../texts";

const { width, height } = Dimensions.get("window");

const HeaderTitle = ({
  modal,
  title,
  style,
  noCapital,
  noPadding,
  noBack = false,
  rightIcon,
  titleStyle,
  animatedStyle,
  onRightPress,
  onBackPress,
  rightButton,
  onTitlePress,
  rightComponent,
  headerY,
  isScrollView,
}) => {
  const navigation = useNavigation();

  const titleWithoutBack = {
    marginLeft: noBack != undefined ? 0 : 12,
  };

  const _onPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (modal) {
      navigation.dismissModal();
    } else {
      navigation.pop();
    }
  };

  const animatedHeaderStyle = useAnimatedStyle(() => {
    if (style?.backgroundColor) {
      return {};
    }

    if (!headerY) {
      return {};
    }

    const opacity = interpolate(
      headerY.value,
      [0, height / 8],
      [0, 1],
      Extrapolate.CLAMP
    );

    let top = 0;
    if (isScrollView && headerY.value >= 0) {
      top = headerY.value;
    }

    return {
      top,
      backgroundColor: `rgba(9,6,22,${opacity})`,
    };
  });

  const containerStyle = useMemo(() => {
    return [
      animatedHeaderStyle,
      styles.container,
      {
        paddingBottom: !noBack && rightIcon ? "2%" : "3%",
        paddingTop: noPadding ? 0 : insets.top,
      },
      style,
    ];
  }, [noBack]);

  return (
    <FadeAnimatedView mode="fade-up" style={containerStyle}>
      {noBack != true && (
        <IconButton
          side={ICON_SIZES.one}
          inset={6}
          onPress={_onPress}
          style={{ marginLeft: 8 }}
          source={
            modal == undefined ? icons.Chevrons.Left : icons.Chevrons.Down
          }
        />
      )}
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onTitlePress}
          style={{
            alignSelf: "flex-start",
          }}
          disabled={!onTitlePress}
        >
          <MainText
            font="title-6"
            numberOfLines={1}
            style={[
              titleWithoutBack,
              animatedStyle,
              {
                marginRight: "4%",
                marginLeft: noBack == true ? 14 : "2%",
              },
              titleStyle,
            ]}
          >
            {noCapital ? title : capitalizeFirstLetter(title)}
          </MainText>
        </TouchableOpacity>
      </View>

      {rightIcon && (
        <IconButton
          inset={2}
          side="two"
          source={rightIcon}
          onPress={onRightPress}
        />
      )}
      {rightButton != undefined && rightButton()}

      {rightComponent != undefined && rightComponent()}
    </FadeAnimatedView>
  );
};
export default memo(HeaderTitle);

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: "2%",
    paddingRight: "3%",
    borderRadius: 2,
    top: 0,
    zIndex: 10,
    height: NAVIGATION_BAR_HEIGHT,
  },
});
