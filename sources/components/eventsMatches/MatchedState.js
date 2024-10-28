import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { useEventActivity, useLanguages, useTheme, useUser } from "../../hooks";
import { widthPercentage } from "../../styles/sizes";
import { AnimatedTransitionView } from "../animations";
import { CacheableImageView } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";
import AcceptMatchState from "./AcceptMatchState";
import QrCodeMatchState from "./QrCodeMatchState";

const PROFILE_PICTURE = widthPercentage(0.45);

const MatchedState = ({ onProfilePress }) => {
  const theme = useTheme();

  const {
    match,
    isMatchStarted,
    isMatchAccepted,
    isMatchWaitingForAccept,
    isMatchOngoing,

    skipMatch,
    acceptMatch,
  } = useEventActivity();

  const matchedProfile = match?.profile;

  const { languageContent } = useLanguages();

  const mySelf = useUser();

  const [isAnimationCompleted, setIsAnimationCompleted] = useState(false);

  useEffect(() => {
    if (isMatchStarted) {
      setTimeout(() => {
        setIsAnimationCompleted(true);
      }, 500);

      return () => {
        setIsAnimationCompleted(false);
      };
    }
  }, [isMatchStarted]);
  /* Styles */

  const firstPictureContainerStyle = useMemo(() => {
    return {
      backgroundColor: theme.colors.second_background,
      ...styles.firstPictureContainer,
    };
  }, []);

  if (!match) {
    return null;
  }

  return (
    <Animated.View exiting={FadeOut} style={styles.container}>
      <View style={styles.picturesContainer}>
        <View style={firstPictureContainerStyle}>
          <BounceView onPress={onProfilePress}>
            <CacheableImageView
              source={matchedProfile?.picture}
              style={styles.profilePicture}
            />
          </BounceView>
        </View>

        <View style={styles.secondPictureContainer}>
          <CacheableImageView
            source={mySelf.picture}
            style={styles.profilePicture}
          />
        </View>
      </View>

      <View style={styles.matchTitle}>
        <MainText bold align="center" font="title-5">
          {languageContent.your_match_is} {matchedProfile?.username}
        </MainText>
      </View>

      {isMatchStarted && (
        <View>
          <AnimatedTransitionView
            isVisible={isMatchWaitingForAccept || isMatchAccepted}
          >
            <AcceptMatchState
              onPress={acceptMatch}
              onSkipMatchPress={skipMatch}
            />
          </AnimatedTransitionView>

          {isAnimationCompleted && (
            <>
              <AnimatedTransitionView
                direction={"left"}
                isVisible={isMatchOngoing}
                style={styles.absoluteContent}
              >
                <QrCodeMatchState match={match} />
              </AnimatedTransitionView>
            </>
          )}
        </View>
      )}
    </Animated.View>
  );
};

export default MatchedState;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: "3%",
  },
  picturesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -10,
  },
  profilePicture: {
    width: PROFILE_PICTURE,
    height: PROFILE_PICTURE,
    borderRadius: PROFILE_PICTURE / 2.2,
  },
  firstPictureContainer: {
    width: PROFILE_PICTURE + 20,
    height: PROFILE_PICTURE + 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: PROFILE_PICTURE / 2 + 8,
  },
  secondPictureContainer: {
    zIndex: -1,
    marginLeft: -PROFILE_PICTURE / 1.6,
  },
  matchTitle: {
    marginTop: "3%",
  },
  absoluteContent: {
    width: "100%",
    position: "absolute",
  },
});
