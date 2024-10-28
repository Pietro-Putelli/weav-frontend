import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import { useSelector } from "react-redux";
import {
  useAppState,
  useEventActivity,
  useLanguages,
  useTheme,
} from "../../hooks";
import { getCurrentEventUserMatchAcceptedAt } from "../../store/slices/eventActivitesReducer";
import { fonts, icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView, ScaleAnimatedView } from "../animations";
import { DoubleStateButton } from "../buttons";
import { MainText } from "../texts";

const MATCH_NUMBER_SIDE = widthPercentage(0.35);
const RADIUS = MATCH_NUMBER_SIDE / 2;
const MAX_VALUE = 1 * 60;

const AcceptMatchState = ({ onPress }) => {
  const theme = useTheme();

  const { match, matchProfile, isMatchAccepted, skipMatch } =
    useEventActivity();

  const { languageContent } = useLanguages();

  const [skipMatchEnabled, setSkipMatchEnabled] = useState(false);

  const matchAcceptedAt = useSelector(getCurrentEventUserMatchAcceptedAt);
  const [seconds, setSeconds] = useState(MAX_VALUE);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;

    const formattedSeconds = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;

    return `${minutes}:${formattedSeconds}`;
  }, [seconds]);

  useEffect(() => {
    let interval = null;

    if (!isMatchAccepted) {
      return;
    }

    interval = setInterval(() => {
      setSeconds((prevSeconds) =>
        prevSeconds > 0 ? prevSeconds - 1 : prevSeconds
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isMatchAccepted]);

  useEffect(() => {
    if (seconds == 0) {
      setSkipMatchEnabled(true);
    }
  }, [seconds]);

  useAppState(() => {
    setupInitialSeconds();
  }, [matchAcceptedAt]);

  /* Methods */

  const setupInitialSeconds = () => {
    let value = MAX_VALUE;

    if (matchAcceptedAt) {
      const diff = moment().diff(matchAcceptedAt, "seconds");

      value = Math.max(0, MAX_VALUE - diff);
    }

    setSeconds(value);
  };

  /* Callbacks */

  const _onPress = () => {
    if (skipMatchEnabled) {
      skipMatch();
    } else {
      onPress?.();
    }
  };

  const matchNumberContainerStyle = useMemo(() => {
    return [
      theme.styles.shadow_round,
      { backgroundColor: theme.colors.background },
      styles.matchNumberContainer,
    ];
  }, []);

  const { buttonTitles, buttonIcons } = useMemo(() => {
    return {
      buttonTitles: [languageContent.accept_match, languageContent.skip_match],
      buttonIcons: [icons.Done, icons.Arrows.Right],
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScaleAnimatedView style={matchNumberContainerStyle}>
        <CircularProgressBase
          radius={RADIUS}
          value={seconds}
          maxValue={MAX_VALUE}
          progressValueColor={theme.colors.main_accent}
          activeStrokeColor={theme.colors.main_accent}
        >
          <Text style={styles.number}>{match.number}</Text>
          <MainText bold>{formattedTime}</MainText>
        </CircularProgressBase>
      </ScaleAnimatedView>

      <View style={styles.content}>
        <MainText align="center" font="title-8" style={styles.title}>
          {languageContent.find} {matchProfile?.username}{" "}
          {languageContent.and_win_free_drink}
          🍸
        </MainText>

        <DoubleStateButton
          haptic
          type="done"
          icon={icons.Done}
          titles={buttonTitles}
          icons={buttonIcons}
          onPress={_onPress}
          isActive={isMatchAccepted}
          disabled={isMatchAccepted && !skipMatchEnabled}
        />

        {isMatchAccepted && (
          <FadeAnimatedView style={styles.descriptionContainer}>
            <MainText
              color={theme.colors.secondText}
              font="subtitle-4"
              align="center"
            >
              {languageContent.both_need_to_accept_match}
            </MainText>
          </FadeAnimatedView>
        )}
      </View>
    </View>
  );
};

export default AcceptMatchState;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: "8%",
  },
  content: {
    marginTop: "6%",
  },
  matchNumberContainer: {
    width: MATCH_NUMBER_SIDE,
    height: MATCH_NUMBER_SIDE,
    borderRadius: MATCH_NUMBER_SIDE / 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  number: {
    color: "white",
    fontFamily: fonts.Bold,
    fontWeight: "600",
    fontSize: MATCH_NUMBER_SIDE / 3,
    marginBottom: 4,
  },
  title: {
    marginBottom: "6%",
    marginHorizontal: "4%",
  },
  descriptionContainer: {
    marginTop: "4%",
    marginHorizontal: "4%",
  },
});
