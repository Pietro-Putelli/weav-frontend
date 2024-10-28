import { isEmpty } from "lodash";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { UserProfileCell } from "../../components/cells";
import { MainText } from "../../components/texts";
import { useEventActivity, useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";

const PROFILE_PICTURE_SIDE = widthPercentage(0.12);

const JoinEventState = ({ onPress, isLoading }) => {
  const { participants, participantsCount, isMatchCompleted } =
    useEventActivity();

  const hasParticipants = !isEmpty(participants);

  const { languageContent, language } = useLanguages();

  const title = useMemo(() => {
    if (isMatchCompleted) {
      return languageContent.event_match_completed_title;
    }
    return languageContent.event_match_title;
  }, [isMatchCompleted]);

  const participantsTitle = useMemo(() => {
    if (language === "en") {
      return `and ${participantsCount} more`;
    }
    return `e altri ${participantsCount}`;
  }, [participantsCount]);

  return (
    <View>
      <View style={styles.content}>
        <MainText font="title-6" bold>
          {title}
        </MainText>

        {!isMatchCompleted && (
          <MainText
            style={{ marginTop: "3%", marginLeft: 2 }}
            font="subtitle-3"
          >
            {languageContent.event_match_description}
          </MainText>
        )}

        {hasParticipants && (
          <View style={styles.friendsContainer}>
            {participants.map((user, index) => {
              return (
                <View
                  style={{
                    marginLeft: index > 0 ? -25 : 0,
                    zIndex: 6 - index,
                  }}
                  key={index}
                >
                  <UserProfileCell
                    hideLabel
                    side={PROFILE_PICTURE_SIDE}
                    user={user}
                    disabled
                  />
                </View>
              );
            })}

            {participantsCount > 0 && (
              <MainText
                bold
                font="subtitle-1"
                style={{ flex: 1, marginLeft: "4%" }}
              >
                {participantsTitle}
              </MainText>
            )}
          </View>
        )}
      </View>
      <View style={styles.button}>
        <SolidButton
          haptic
          type="done"
          title={languageContent.buttons.start_matching}
          icon={icons.Chance}
          onPress={onPress}
          loading={isLoading}
        />

        {isLoading && (
          <FadeAnimatedView style={styles.waitingLabel}>
            <MainText font="subtitle-2">
              {languageContent.we_are_matching_you}
            </MainText>
          </FadeAnimatedView>
        )}
      </View>
    </View>
  );
};

export default JoinEventState;

const styles = StyleSheet.create({
  content: {
    marginTop: "5%",
    marginHorizontal: "2%",
  },
  button: {
    marginTop: "8%",
    marginHorizontal: 2,
  },
  friendsContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: "8%",
  },
  waitingLabel: {
    marginTop: "5%",
    alignItems: "center",
  },
});
