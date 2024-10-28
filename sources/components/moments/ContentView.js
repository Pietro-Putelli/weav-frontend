import { isNull } from "lodash";
import React, { memo, useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SCREENS } from "../../constants/screens";
import { formatMomentDuration } from "../../dates/formatters";
import { useLanguages, useUser } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { PROFILE_IMAGE_SIDE } from "../../styles/sizes";
import { OR, isNullOrUndefined } from "../../utility/boolean";
import { isNullOrEmpty } from "../../utility/strings";
import { IconButton } from "../buttons";
import { ProfilePicture } from "../images";
import { MainText, MentionText } from "../texts";
import MomentParticipantsView from "./MomentParticipantsView";
import TagsList from "./TagsList";

const ContentView = ({
  componentId,
  moment,
  isPreview,
  disabledMenu,
  isChatPreview,
  onMenuPress,
  moreButtonHidden,
  isShotPreview,
  disableProfilePress,
  onFriendsPress,
}) => {
  const { user, content, source, end_at, url_tag, location_tag, participants } =
    moment;

  const userId = user?.id;
  const { username: myUsername, userId: myUserId, amI } = useUser({ userId });

  const momentId = moment.id;
  const participantUsers = participants?.users;
  const isAnonymous = moment.is_anonymous;

  const firstParticipant = participantUsers?.[0];
  const disabledParticipants =
    participants.count === 1 && firstParticipant.id === myUserId;

  /* States */

  const isContentNull = isNullOrEmpty(content);

  const disabledMenuButton = OR(isPreview, isChatPreview, disabledMenu);
  const disableProfileNext = isPreview || amI;

  const { languageContent } = useLanguages();

  const { hasTags, hasParticipants } = useMemo(() => {
    const hasTags = !isNull(url_tag) || !isNull(location_tag);
    const hasParticipants = !isNullOrUndefined(participantUsers);

    return {
      hasTags,
      hasParticipants,
    };
  }, [moment]);

  /* Callbacks */

  const onPofilePress = useCallback(() => {
    if (disableProfilePress) {
      return;
    }

    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user },
    });
  }, [disableProfilePress, moment]);

  const onUserTagPress = useCallback(
    (username) => {
      if (isPreview) {
        return;
      }

      if (username != myUsername) {
        pushNavigation({
          componentId,
          screen: SCREENS.Profile,
          passProps: { user: { username } },
        });
      }
    },
    [isPreview, moment]
  );

  /* Styles */

  const usernameContainerStyle = useMemo(() => {
    return {
      marginBottom: isContentNull ? 0 : 4,
      ...styles.usernameContainer,
    };
  }, [isContentNull]);

  const sharedProps = useMemo(() => {
    if (isChatPreview) {
      let numberOfLines = 2;

      if (source == null) {
        numberOfLines = 4;
      }

      return {
        content: {
          numberOfLines,
        },
        profile: {
          side: PROFILE_IMAGE_SIDE * 0.8,
        },
      };
    }

    return {
      profile: {
        side: PROFILE_IMAGE_SIDE,
      },
    };
  }, []);

  const tagsListProps = useMemo(() => {
    return {
      moment,
      componentId,
      style: styles.tagList,
    };
  }, [moment]);

  const participantsPreviewProps = useMemo(() => {
    return {
      momentId,
      participants,
      onPress: onFriendsPress,
      disabled: disabledParticipants,
    };
  }, [momentId, onFriendsPress, participants]);

  const innerContainerStyle = useMemo(() => {
    if (isContentNull) {
      return [styles.innerContainer, { alignItems: "center" }];
    }

    return styles.innerContainer;
  }, [isContentNull]);

  const username = useMemo(() => {
    const username = isAnonymous ? languageContent.anonymous : user?.username;

    if (amI) {
      return `${languageContent.you.capitalize()} ${
        isAnonymous ? "(" + languageContent.anonymous.toLowerCase() + ")" : ""
      }`;
    }

    return username;
  }, [amI, moment]);

  return (
    <View>
      <View style={styles.content}>
        <View style={innerContainerStyle}>
          <ProfilePicture
            isBlur={isAnonymous && !amI}
            source={user?.picture}
            onPress={onPofilePress}
            {...sharedProps.profile}
            disabled={disableProfileNext}
          />

          <View style={styles.textContainer}>
            <View style={usernameContainerStyle}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onPofilePress}
                  disabled={disableProfileNext || disableProfilePress}
                >
                  <MainText bold font="subtitle-1" numberOfLines={1}>
                    {username}
                  </MainText>
                </TouchableOpacity>
              </View>

              {isContentNull && !hasTags && hasParticipants && (
                <MomentParticipantsView
                  style={styles.friendsReplyContentNull}
                  {...participantsPreviewProps}
                />
              )}

              <MainText bold font="subtitle-5">
                {formatMomentDuration(end_at)}
              </MainText>

              {!moreButtonHidden && !isShotPreview && (
                <IconButton
                  inset={3}
                  side="three"
                  source={icons.More}
                  onPress={onMenuPress}
                  style={{ marginLeft: 4 }}
                  disabledWithoutOpacity={disabledMenuButton}
                />
              )}
            </View>

            {!isContentNull && (
              <View style={styles.row}>
                <MentionText
                  font="subtitle-2"
                  style={styles.textContent}
                  onTagPress={onUserTagPress}
                  {...sharedProps.content}
                >
                  {content}
                </MentionText>

                {!hasTags && hasParticipants && (
                  <MomentParticipantsView {...participantsPreviewProps} />
                )}
              </View>
            )}
          </View>
        </View>

        {hasTags && (
          <View style={styles.tagContainer}>
            <TagsList {...tagsListProps} />

            {hasParticipants && (
              <MomentParticipantsView
                {...participantsPreviewProps}
                style={styles.tagInlineFriendContainer}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(ContentView);

const styles = StyleSheet.create({
  content: {
    padding: 14,
  },
  innerContainer: {
    flexDirection: "row",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContent: {
    flex: 1,
    marginTop: 2,
    marginLeft: 2,
    marginRight: 8,
  },
  tagList: {
    flex: 1,
    marginTop: "1%",
  },
  friendsReplyContentNull: {
    marginRight: 12,
  },
  tagContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  tagInlineFriendContainer: {
    marginLeft: 8,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
});
