import React, { memo, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { formatTimeAgo } from "../../dates/formatters";
import { useLanguages, useTheme, useUser } from "../../hooks";
import { pushNavigation, showSheetNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { PROFILE_IMAGE_SIDE } from "../../styles/sizes";
import { isAndroidDevice } from "../../utility/functions";
import { AnimatedBlurView, ScaleAnimatedView } from "../animations";
import { BadgeCountView } from "../badgeviews";
import { IconButton } from "../buttons";
import { ProfilePicture } from "../images";
import SwipeableContainer from "../moments/SwipeableContainer";
import { MainText } from "../texts";
import { BounceView } from "../views";

const isAndroid = isAndroidDevice();

const SpotCell = ({
  componentId,
  onSwiped,
  onPress,
  onLongPress,
  onDeleted,
  spot,
  isMine,
}) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const {
    profile,
    created_at,
    content,
    is_replied: isReplied,
    is_anonymous: isAnonymous,
    replies_count,
  } = spot;

  const repliesCount = replies_count ?? 0;

  const { amI } = useUser({ userId: profile?.id });

  const swipeDisabled = amI || isReplied;

  /* Callbacks */

  const onMenuPress = () => {
    showSheetNavigation({
      screen: SCREENS.MenuModal,
      passProps: {
        type: actiontypes.MENU_MODAL.SPOT_DETAIL,
        isMine: amI,
        spot,
        onDeleted,
      },
    });
  };

  const onProfilePress = () => {
    if (amI) {
      return;
    }

    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user: profile },
    });
  };

  const _onPress = () => {
    if (onPress) {
      onPress(spot);
    }

    if (amI) {
      pushNavigation({
        componentId,
        screen: SCREENS.SpotReplies,
        passProps: { spotId: spot.id, business: spot.business },
      });
    }
  };

  const _onLongPress = () => {
    if (amI) {
      onMenuPress();
    } else if (onLongPress) {
      onLongPress(spot);
    } else {
      _onPress();
    }
  };

  /* Styles */

  const containerStyle = useMemo(() => {
    return [styles.container, theme.styles.shadow_round];
  }, []);

  const repliedBadgeStyle = useMemo(() => {
    return {
      marginTop: 8,
      borderRadius: 4,
      paddingVertical: 2,
      paddingHorizontal: 4,
      backgroundColor: theme.colors.main_accent,
    };
  }, []);

  const username = useMemo(() => {
    const username = isAnonymous
      ? languageContent.anonymous
      : profile?.username;

    if (amI) {
      return `You ${
        isAnonymous ? "(" + languageContent.anonymous.toLowerCase() + ")" : ""
      }`;
    }

    return username;
  }, [amI]);

  return (
    <SwipeableContainer
      rightIcon={icons.Bow}
      disabled={swipeDisabled}
      onSwipeLeft={() => onSwiped(spot)}
    >
      <BounceView
        onPress={_onPress}
        onLongPress={_onLongPress}
        style={containerStyle}
      >
        <View style={styles.content}>
          <View style={styles.profilePictureContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isAnonymous}
              onPress={onProfilePress}
              style={styles.profilePicture}
            >
              <ProfilePicture
                source={profile?.picture}
                side={PROFILE_IMAGE_SIDE}
                blurRadius={isAndroid ? 50 : 0}
              />

              {!isAndroid && (
                <AnimatedBlurView
                  intensity={50}
                  visible={isAnonymous && !amI}
                  style={styles.blurOverlay}
                />
              )}
            </TouchableOpacity>

            {isReplied && (
              <ScaleAnimatedView style={repliedBadgeStyle}>
                <MainText font="subtitle" style={{ fontSize: 10 }} uppercase>
                  {languageContent.replied}
                </MainText>
              </ScaleAnimatedView>
            )}

            {amI && isMine && (
              <BadgeCountView count={repliesCount} scale={1.2} />
            )}
          </View>

          <View style={styles.textContent}>
            <View style={styles.usernameContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ flex: 1 }}
                disabled={isAnonymous}
                onPress={onProfilePress}
              >
                <MainText font="subtitle-1" bold style={styles.usernameTitle}>
                  {username}
                </MainText>
              </TouchableOpacity>

              <MainText bold font="subtitle-5">
                {formatTimeAgo(created_at)}
              </MainText>

              <IconButton
                inset={3}
                side="three"
                source={icons.More}
                onPress={onMenuPress}
                style={{ marginLeft: 8 }}
              />
            </View>

            <MainText style={{ marginLeft: 2 }} font="subtitle-2">
              {content}
            </MainText>
          </View>
        </View>
      </BounceView>
    </SwipeableContainer>
  );
};

export default memo(SpotCell);

const styles = StyleSheet.create({
  container: {
    padding: "4%",
    marginBottom: 12,
    marginHorizontal: 6,
  },
  content: {
    flexDirection: "row",
  },
  textContent: {
    flex: 1,
    marginLeft: "3%",
  },
  profilePicture: {
    width: PROFILE_IMAGE_SIDE,
    height: PROFILE_IMAGE_SIDE,
  },
  usernameTitle: {
    flex: 1,
  },
  usernameContainer: {
    marginBottom: "2%",
    flexDirection: "row",
    alignItems: "center",
  },
  blurOverlay: {
    overflow: "hidden",
    width: PROFILE_IMAGE_SIDE,
    height: PROFILE_IMAGE_SIDE,
    transform: [{ scale: 1.02 }],
    borderRadius: PROFILE_IMAGE_SIDE / 2.2,
  },
  profilePictureContainer: {
    alignItems: "center",
  },
});
