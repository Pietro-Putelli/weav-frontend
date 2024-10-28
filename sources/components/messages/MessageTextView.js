import React, { memo, useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SCREENS } from "../../constants/screens";
import { useCurrentBusiness, useUser } from "../../hooks";
import { CHAT_TYPES } from "../../hooks/useChat";
import { pushNavigation, showStackModal } from "../../navigation/actions";
import { widthPercentage } from "../../styles/sizes";
import { isNullOrUndefined } from "../../utility/boolean";
import { ReplyGestureHandler } from "../gestures";
import { ProfilePicture } from "../images";
import { EventCell, MomentCell } from "../moments";
import { BounceView } from "../views";
import BusinessMessage from "./BusinessMessage";
import ContentMessage from "./ContentMessage";
import MessageInfoView from "./MessageInfoView";
import ReactionMessage from "./ReactionMessage";
import SendingView from "./SendingView";
import UserProfileMessage from "./UserProfileMessage";

const { width } = Dimensions.get("window");

const MARGIN_LIMIT = widthPercentage(0.12);
const MARGIN_HORIZONTAL = width / 24;
const PROFILE_IMAGE_SIDE = widthPercentage(0.08);

const MessageTextView = ({
  message,
  receiver,
  highlight,
  business,
  chatType,
  componentId,
}) => {
  const translateX = useSharedValue(0);

  const user = useUser();
  const { isBusiness } = useCurrentBusiness();

  const {
    sender,
    reaction,
    content,
    user_profile,
    business_profile,
    moment,
    event,
  } = message;

  const isReaction = reaction != null;
  const isUserProfile = user_profile != null;
  const isVenueProfile = business_profile != null;
  const isEmojieReaction = reaction == "emojie";

  const isUserMoment = !isNullOrUndefined(moment);
  const isEvent = !isNullOrUndefined(event);

  const isSender = useMemo(() => {
    const userId = user.id;

    return Boolean(
      userId == sender ||
        userId == sender?.id ||
        (isBusiness && !message.is_user) ||
        (!isBusiness && message.is_user)
    );
  }, [sender, message]);

  const isDiscussion = chatType == CHAT_TYPES.DISCUSSION;

  const disabledReply =
    isUserProfile || isReaction || isVenueProfile || isUserMoment || isEvent;

  /* Callbacks */

  const onMomentPress = () => {
    if (isUserMoment) {
      showStackModal({
        isTransparent: true,
        screen: SCREENS.PreviewMoment,
        passProps: { moment: moment, isChatPreview: true },
      });
    }
  };

  const onProfilePress = useCallback(() => {
    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user: sender },
    });
  }, []);

  /* Methods */

  const renderContent = () => {
    if (isUserMoment) {
      return (
        <BounceView onPress={onMomentPress}>
          <MomentCell isChatPreview moment={moment} componentId={componentId} />
          {isEmojieReaction && (
            <View style={styles.emojie_container}>
              <Text style={styles.emojie_text}>{content}</Text>
            </View>
          )}
        </BounceView>
      );
    } else if (isEvent) {
      return (
        <EventCell isChatPreview moment={event} componentId={componentId} />
      );
    } else if (isReaction) {
      return (
        <ReactionMessage
          message={message}
          receiver={receiver}
          isSender={isSender}
          componentId={componentId}
        />
      );
    } else if (isUserProfile) {
      return <UserProfileMessage componentId={componentId} message={message} />;
    } else if (isVenueProfile) {
      return <BusinessMessage componentId={componentId} message={message} />;
    } else {
      return (
        <ContentMessage
          message={message}
          chatType={chatType}
          isSender={isSender}
          receiver={receiver}
          business={business}
          highlight={highlight}
          componentId={componentId}
          isDiscussion={isDiscussion}
        />
      );
    }
  };

  const replyContainerStyle = useMemo(() => {
    return [
      styles.container,
      {
        flex: 1,
        justifyContent: isSender ? "flex-end" : "flex-start",
        marginLeft: isSender ? MARGIN_LIMIT : 0,
        marginRight: isSender ? 0 : MARGIN_LIMIT,
      },
    ];
  }, [isSender]);

  return (
    <Animated.View>
      <View style={styles.external_container}>
        <ReplyGestureHandler
          isSender={isSender}
          translateX={translateX}
          disabled={disabledReply}
          style={replyContainerStyle}
          onReply={() => onReply(message)}
        >
          {isDiscussion && !isSender && (
            <View style={styles.profileContainer}>
              <ProfilePicture
                onPress={onProfilePress}
                side={PROFILE_IMAGE_SIDE}
                source={sender.picture}
              />
            </View>
          )}
          {renderContent()}
          <SendingView message={message} />
        </ReplyGestureHandler>
      </View>

      <MessageInfoView
        translateX={translateX}
        isSender={isSender}
        message={message}
      />
    </Animated.View>
  );
};
export default memo(MessageTextView);

const styles = StyleSheet.create({
  external_container: {
    flexDirection: "row",
    marginVertical: 6,
    marginHorizontal: MARGIN_HORIZONTAL,
  },
  container: {
    width,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  info_container: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: -1,
    bottom: 12,
  },
  emojie_container: {
    right: -12,
    bottom: -12,
    position: "absolute",
  },
  emojie_text: {
    fontSize: RFPercentage(7),
  },
  profileContainer: {
    marginRight: 8,
    marginLeft: -8,
  },
});
