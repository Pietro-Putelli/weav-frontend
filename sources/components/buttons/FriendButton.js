import { MotiView } from "moti";
import React, { memo, useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useFriends, useLanguages, useTheme } from "../../hooks";
import { FRIEND_STATES } from "../../hooks/useFriends";
import { icons } from "../../styles";
import { BORDER_RADIUS, BUTTON_HEIGHT, ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const transition = {
  type: "timing",
  duration: 400,
};

const FriendButton = ({ user }) => {
  const theme = useTheme();

  const { languageContent } = useLanguages();
  const languageContentButtons = languageContent.buttons;

  const { friendState, requestFriend } = useFriends({ profile: user });

  const friendStateValue = useMemo(() => {
    switch (friendState) {
      case FRIEND_STATES.NONE:
        return 0;
      case FRIEND_STATES.MY_REQUEST:
        return 1;
      case FRIEND_STATES.USER_REQUEST:
        return 2;
      case FRIEND_STATES.FRIEND:
        return 3;
      case FRIEND_STATES.LOADING:
        return 4;
    }
  }, [friendState, user]);

  const colorProgress = useSharedValue(friendStateValue);

  /* Effects */

  useEffect(() => {
    colorProgress.value = friendStateValue;
  }, [friendState]);

  /* Props */

  const buttonTitleProps = useMemo(() => {
    return {
      uppercase: true,
      font: "subtitle-2",
      bold: true,
    };
  }, [friendState]);

  const animatedStyle = useAnimatedStyle(() => {
    const themeColors = theme.colors;

    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1, 2, 3, 4],
      [themeColors.main_accent, themeColors.second_background, themeColors.aqua]
    );
    return { backgroundColor };
  });

  return (
    <BounceView
      haptic
      onPress={requestFriend}
      style={[theme.styles.shadow, styles.container]}
    >
      <Animated.View style={[animatedStyle, styles.content]}>
        {/* Add To Friends */}

        <MotiView
          transition={transition}
          animate={{ scale: friendState == FRIEND_STATES.NONE ? 1 : 0 }}
          style={styles.button}
        >
          <SquareImage
            style={styles.icon}
            source={icons.AddFriend}
            side={ICON_SIZES.three}
          />
          <MainText {...buttonTitleProps}>
            {languageContentButtons.add_to_friends}
          </MainText>
        </MotiView>

        {/* Friend Requested */}

        <MotiView
          transition={transition}
          animate={{ scale: friendState == FRIEND_STATES.MY_REQUEST ? 1 : 0 }}
          style={styles.button}
        >
          <MainText {...buttonTitleProps}>
            {languageContentButtons.friend_requested}
          </MainText>
        </MotiView>

        {/* Accept Request */}

        <MotiView
          transition={transition}
          animate={{ scale: friendState == FRIEND_STATES.USER_REQUEST ? 1 : 0 }}
          style={styles.button}
        >
          <MainText {...buttonTitleProps}>
            {languageContentButtons.accept_request}
          </MainText>
        </MotiView>

        {/* Your Friend */}
        <MotiView
          transition={transition}
          animate={{ scale: friendState == FRIEND_STATES.FRIEND ? 1 : 0 }}
          style={styles.button}
        >
          <SquareImage
            style={styles.icon}
            source={icons.AddFriend}
            side={ICON_SIZES.three}
          />
          <MainText {...buttonTitleProps}>
            {languageContentButtons.your_friend}
          </MainText>
        </MotiView>
      </Animated.View>
    </BounceView>
  );
};

export default memo(FriendButton);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    height: BUTTON_HEIGHT,
    borderRadius: BORDER_RADIUS * 1.3,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
});
