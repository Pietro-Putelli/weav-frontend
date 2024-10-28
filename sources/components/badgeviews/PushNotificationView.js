import React, { memo, useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { ProfilePicture } from "../../components/images";
import { useTheme } from "../../hooks";
import { getChatType } from "../../hooks/useChat";
import { insets } from "../../styles";
import { formatMessagePreview } from "../../utility/formatters";
import { MainText } from "../texts";

const { width, height } = Dimensions.get("window");
const CONTAINER_HEIGHT = height / 12;
const COVER_SIDE = CONTAINER_HEIGHT * 0.6;

const VISIBLE_TOP = insets.top;
const HIDDEN_TOP = -CONTAINER_HEIGHT * 1.5;

const PRESENTATION_DURATION = 2000;

const PushNotificationView = ({ states, notification, onPress }) => {
  const { visible, setVisible } = states;

  const { user, business, message, event, chat } = notification;

  const senderUsername = message?.sender?.username;
  const source = user?.picture ?? business?.cover_source ?? event?.cover;
  const username = user?.username ?? business?.name ?? event?.title;
  const chatType = getChatType(chat);

  const content = useMemo(() => {
    const messageContent = formatMessagePreview({
      message,
      I: false,
      chatType,
    });

    if (senderUsername) {
      return messageContent;
    }
    return messageContent;
  }, [message]);

  const top = useSharedValue(HIDDEN_TOP);
  const theme = useTheme();

  /* Effects */

  useEffect(() => {
    if (visible) {
      top.value = withSpring(VISIBLE_TOP, { damping: 12 }, (finished) => {
        if (finished) {
          top.value = withDelay(
            PRESENTATION_DURATION,
            withSpring(HIDDEN_TOP, { damping: 12 })
          );
          runOnJS(setVisible)(false);
        }
      });
    }
  }, [visible]);

  /* Gesture */

  const panGesture = Gesture.Pan().onChange(({ velocityY }) => {
    if (velocityY < 0) {
      top.value = withSpring(HIDDEN_TOP, { damping: 12 });
      runOnJS(setVisible)(false);
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    return { top: top.value };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[theme.styles.shadow_round, styles.container, animatedStyle]}
      >
        <TouchableOpacity
          onPress={() => {
            top.value = withSpring(HIDDEN_TOP, { damping: 12 });
            onPress();

            setTimeout(() => {
              setVisible(false);
            }, 1000);
          }}
          activeOpacity={0.7}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <ProfilePicture disabled side={COVER_SIDE} source={source} />

          <View style={styles.content}>
            <MainText
              bold
              font={"subtitle"}
              numberOfLines={1}
              style={{ marginBottom: "1%" }}
            >
              {username}
            </MainText>

            <MainText
              numberOfLines={2}
              font={"subtitle-1"}
              style={{ marginLeft: "0.5%" }}
            >
              {content}
            </MainText>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};
export default memo(PushNotificationView);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    paddingHorizontal: "4%",
    paddingVertical: "2.5%",
    alignSelf: "center",
    borderRadius: 20,
    width: width - 16,
  },
  content: {
    marginLeft: "3%",
    flex: 1,
  },
});
