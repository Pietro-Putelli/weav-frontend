import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const EventParticipantsCell = ({ event, onPress }) => {
  const theme = useTheme();
  const { getPluralAwareWord } = useLanguages();

  const participantsCount = Math.max(0, event?.participants_count || 0);
  const friendsCount = event?.participants?.count ?? 0;
  const hasFriends = friendsCount > 0;

  const containerStyle = useMemo(() => {
    return [theme.styles.cell, styles.container];
  }, []);

  return (
    <FadeAnimatedView disabled>
      <BounceView
        disabledWithoutOpacity={!hasFriends}
        onPress={onPress}
        style={containerStyle}
      >
        <SquareImage
          coloredIcon
          side={ICON_SIZES.one}
          source={icons.ColoredFriends}
        />

        <MainText bold font="subtitle" style={{ flex: 1, marginLeft: "3%" }}>
          {participantsCount}{" "}
          <MainText bold uppercase font="subtitle-4">
            {getPluralAwareWord({
              word: "participant",
              count: participantsCount,
            })}
          </MainText>
        </MainText>

        {hasFriends && (
          <MainText
            font="subtitle-4"
            bold
            uppercase
            numberOfLines={2}
            style={{ maxWidth: "24%" }}
          >
            {friendsCount}{" "}
            {getPluralAwareWord({ word: "friend", count: friendsCount })}
          </MainText>
        )}

        {hasFriends && (
          <SquareImage
            style={{ marginLeft: 8 }}
            source={icons.Chevrons.Right}
            side={ICON_SIZES.chevron_right}
            color={theme.white_alpha(0.5)}
          />
        )}
      </BounceView>
    </FadeAnimatedView>
  );
};

export default memo(EventParticipantsCell);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "3%",
    paddingVertical: "3.5%",
  },
});
