import _, { isUndefined, size } from "lodash";
import React, { memo, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Analytics, analyticTypes } from "../../analytics";
import { SCREENS } from "../../constants/screens";
import { useUser } from "../../hooks";
import {
  pushNavigation,
  showCrossFadeModal,
  showModalNavigation,
  showSheetNavigation,
} from "../../navigation/actions";
import { MomentCellPreviewSize, MomentCellSize } from "../../styles/sizes";
import { IS_ALL_NULL, OR, isNullOrUndefined } from "../../utility/boolean";
import { triggerHaptic } from "../../utility/haptics";
import { BounceView } from "../views";
import BusinessCell from "./BusinessCell";
import MediaCell from "./MediaCell";
import SwipeableContainer from "./SwipeableContainer";
import TextCell from "./TextCell";
import UserMentionEventCell from "./UserMentionEventCell";

const MomentCell = ({
  moment,
  onPress,
  onMenuPress,
  isPreview,
  componentId,
  disabledMenu,
  isShotPreview,
  isChatPreview,
  onMomentReacted,
  onDeleted,
  hideBusinessImage,
  ...props
}) => {
  /* PROPS */

  const {
    user,
    source,
    business_tag,
    event,
    participants,
    id: momentId,
  } = moment;

  const participantUsers = participants?.users;
  const participantsSize = size(participantUsers);
  const participantsCount = participants?.count;

  const isTextCell = IS_ALL_NULL(source, business_tag, event);
  const isBusinessTagCell = !_.isNull(business_tag);
  const isEventCell = !isNullOrUndefined(event);

  const userId = user?.id;
  const { amI } = useUser({ userId });

  const disabledGestures = OR(
    isChatPreview,
    disabledMenu,
    isPreview,
    isShotPreview,
    onDeleted
  );

  const swipeDisabled = OR(isUndefined(onMomentReacted), disabledGestures, amI);

  const _onMenuPress = useCallback(() => {
    triggerHaptic();

    if (onMenuPress) {
      onMenuPress();
    } else {
      showModalNavigation({
        screen: SCREENS.Share,
        passProps: { moment, amI, onDeleted },
      });
    }
  }, [amI, moment, onMenuPress, onDeleted]);

  /* Callbacks */

  const onReply = useCallback(() => {
    if (moment?.replied) {
      onMomentReacted(true);
    } else {
      Analytics.sendEvent(analyticTypes.BEGIN_MOMENT_REPLY);

      showCrossFadeModal({
        screen: SCREENS.Reaction,
        passProps: {
          moment,
          onDismiss: onMomentReacted,
        },
      });
    }
  }, [moment, onMomentReacted]);

  const onMomentPress = useCallback(() => {
    if (isEventCell) {
      pushNavigation({
        componentId,
        screen: SCREENS.EventDetail,
        passProps: {
          eventId: event?.id,
        },
      });
    } else if (isBusinessTagCell) {
      pushNavigation({
        componentId,
        screen: SCREENS.VenueDetail,
        passProps: { initialBusiness: business_tag },
      });
    }
  }, [moment]);

  /* Handle Participants when tap on the list */

  const onFriendsPress = useCallback(() => {
    if (participantsSize === 1) {
      const user = participantUsers[0];

      pushNavigation({
        componentId,
        screen: SCREENS.Profile,
        passProps: { user },
      });
      return;
    }

    showSheetNavigation({
      isStack: true,
      screen: SCREENS.MomentParticipants,
      passProps: { momentId, participantsCount },
    });
  }, [participantUsers, participantsCount]);

  const _onPress = onPress ? onPress : onMomentPress;

  /* Props */

  const sharedProps = useMemo(() => {
    return {
      moment,
      componentId,
      isPreview,
      onMenuPress: _onMenuPress,
      isChatPreview,
      disabledMenu,
      isShotPreview,
      onFriendsPress,
      ...props,
    };
  }, [moment, onFriendsPress, _onMenuPress]);

  /* METHODS */

  const CellContent = useMemo(() => {
    if (isBusinessTagCell) {
      if (hideBusinessImage) {
        if (moment.source) {
          return MediaCell;
        }

        return TextCell;
      }

      return BusinessCell;
    }

    if (isTextCell) {
      return TextCell;
    }

    if (isEventCell) {
      return UserMentionEventCell;
    }

    return MediaCell;
  }, [sharedProps]);

  /* Styles */

  const containerStyle = useMemo(() => {
    if (isChatPreview) {
      if (isTextCell) {
        return {
          width: MomentCellPreviewSize.textWidth,
        };
      }

      return {
        width: MomentCellPreviewSize.mediaWidth,
      };
    }

    return styles.container;
  }, []);

  return (
    <BounceView
      onPress={_onPress}
      onLongPress={_onMenuPress}
      disabledWithoutOpacity={disabledGestures}
    >
      <SwipeableContainer
        onSwipeLeft={onReply}
        style={containerStyle}
        disabled={swipeDisabled}
      >
        <CellContent {...sharedProps} />
      </SwipeableContainer>
    </BounceView>
  );
};

export default memo(MomentCell);

const styles = StyleSheet.create({
  container: {
    width: MomentCellSize.width,
    marginBottom: 12,
  },
  more_icon: {
    top: 10,
    right: 14,
    zIndex: 10,
    position: "absolute",
  },
});
