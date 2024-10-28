import React, { memo, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useMyFeeds, useTheme, useUser } from "../../hooks";
import { pushNavigation, showModalNavigation } from "../../navigation/actions";
import { getTutorialState } from "../../store/slices/settingsReducer";
import {
  setFakeUserPosition,
  setUserPosition,
} from "../../store/slices/userReducer";
import { gradients, icons, insets } from "../../styles";
import { BORDER_RADIUS, HOME_HEADER_HEIGHT } from "../../styles/sizes";
import { formatLocationData } from "../../utility/geolocation";
import { FadeAnimatedView } from "../animations";
import HeaderButton from "../buttons/HeaderButton";
import { MainText } from "../texts";
import { BounceView, LinearGradientView } from "../views";

const { height } = Dimensions.get("window");

const HEADER_HIDE_Y = height * 0.25;

const MomentLocationHeader = ({
  componentId,
  onHeaderPress,
  isVisible,
  isMoments,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { city, placeId } = useUser();

  const { myEventsCount } = useMyFeeds();

  const { spots: spotTutorialVisible } = useSelector(getTutorialState);
  const spotsCount = spotTutorialVisible ? 0 : 1;

  const transalteY = useDerivedValue(() => {
    if (isVisible !== undefined) {
      return withSpring(isVisible ? 0 : -HEADER_HIDE_Y, { damping: 16 });
    }
    return 0;
  }, [isVisible]);

  const onPress = () => {
    showModalNavigation({
      screen: SCREENS.Search,
      passProps: {
        mode: actiontypes.SEARCH_SCREEN.CITY,
        onLocationPress: (location) => {
          const place_id = location.id;

          const isNewSelection = place_id != placeId;

          const newLocation = formatLocationData(location);

          if (isNewSelection) {
            dispatch(setFakeUserPosition(newLocation));
          } else {
            dispatch(setUserPosition(newLocation));
          }
        },
        onDismiss: () => {},
      },
    });
  };

  const onMyMomentPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.MyMoments,
    });
  };

  const onSpotPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.Spots,
    });
  };

  const onVenuesPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.BusinessList,
    });
  };

  const onMyEventsPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.MyEvents,
    });
  };

  /* Styles */

  const solidStyle = theme.styles.shadow_round;

  const containerStyle = useMemo(() => {
    if (isMoments) {
      return {
        justifyContent: "center",
        ...styles.container,
      };
    }
    return styles.container;
  }, [isMoments]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transalteY.value }],
    };
  }, []);

  const {
    leftIcon,
    rightIcon,
    iconSidePercentage,
    rightCount,
    leftCount,
    onLeftPress,
    onRightPress,
  } = useMemo(() => {
    return {
      leftIcon: isMoments ? icons.Bow : icons.Marker1,
      rightIcon: isMoments ? icons.Items : icons.Calendar,
      iconSidePercentage: isMoments ? 1 : 1.1,
      leftCount: isMoments ? spotsCount : 0,
      rightCount: isMoments ? 0 : myEventsCount,
      onLeftPress: isMoments ? onSpotPress : onVenuesPress,
      onRightPress: isMoments ? onMyMomentPress : onMyEventsPress,
    };
  }, [spotsCount, myEventsCount]);

  return (
    <TouchableWithoutFeedback onPress={onHeaderPress}>
      <LinearGradientView
        isFromTop
        colors={gradients.DarkVanishing}
        style={styles.gradient_container}
      >
        <FadeAnimatedView
          mode="fade-up"
          style={[containerStyle, containerAnimatedStyle]}
        >
          {!isMoments && (
            <HeaderButton
              icon={leftIcon}
              count={leftCount}
              onPress={onLeftPress}
              iconSidePercentage={iconSidePercentage}
            />
          )}
          <View style={styles.titleContainer}>
            <BounceView
              onPress={onPress}
              style={[solidStyle, styles.titleContent]}
            >
              <MainText
                numberOfLines={1}
                style={{ fontWeight: "500" }}
                font="title-5"
              >
                {city}
              </MainText>
            </BounceView>
          </View>

          <View style={styles.rightButtons}>
            <HeaderButton
              icon={rightIcon}
              count={rightCount}
              onPress={onRightPress}
              iconSidePercentage={iconSidePercentage}
            />
          </View>
        </FadeAnimatedView>
      </LinearGradientView>
    </TouchableWithoutFeedback>
  );
};

export default memo(MomentLocationHeader);

const styles = StyleSheet.create({
  gradient_container: {
    top: 0,
    zIndex: 10,
    width: "100%",
    zIndex: 10,
    paddingBottom: "4%",
    position: "absolute",
    paddingHorizontal: 16,
  },
  container: {
    height: HOME_HEADER_HEIGHT,
    width: "100%",
    marginTop: insets.top,
    flexDirection: "row",
    justifyContent: "center",
  },
  titleContent: {
    justifyContent: "center",
    paddingHorizontal: 20,
    height: "100%",
    borderRadius: BORDER_RADIUS * 1.3,
  },
  titleContainer: {
    flexShrink: 1,
    marginHorizontal: 10,
  },
  sideSquare: {
    alignItems: "center",
    width: HOME_HEADER_HEIGHT,
    justifyContent: "center",
    borderRadius: BORDER_RADIUS * 1.3,
  },
  rightButtons: {
    flexDirection: "row",
  },
  badge: {
    zIndex: 2,
    padding: 4,
    position: "absolute",
    top: -4,
    right: -4,
    borderRadius: 10,
  },
  badgeTitle: {
    fontWeight: "bold",
    fontSize: 12,
  },
});
