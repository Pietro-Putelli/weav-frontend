import { MotiView } from "moti";
import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { RFPercentage } from "react-native-responsive-fontsize";
import TouchableScale from "react-native-touchable-scale";
import { useDispatch, useSelector } from "react-redux";
import { eventlisteners } from "../../constants";
import { SCREENS } from "../../constants/screens";
import {
  useCurrentBusiness,
  useMyBusinessEvents,
  useMyFeeds,
  useReachability,
  useTheme,
  useUser,
} from "../../hooks";
import {
  showModalNavigation,
  showSheetNavigation,
  showStackModal,
} from "../../navigation/actions";
import { getUnreadChatCount } from "../../store/slices/chatsReducer";
import { setUserPosition } from "../../store/slices/userReducer";
import { gradients, icons, insets } from "../../styles";
import { BORDER_RADIUS, ICON_SIZES, widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { BadgeCountView, ReachabilityView } from "../badgeviews";
import { AdjacentTabBarButton } from "../buttons";
import { SquareImage } from "../images";
import { LinearGradientView } from "../views";
import AddPostButton from "./AddPostButton";
import CurrentEventView from "./CurrentEventView";

const { width } = Dimensions.get("window");
const ICON_CONTAINER_SIDE = widthPercentage(0.076);
const ICON_SIDE = ICON_CONTAINER_SIDE * 0.76;
const INITIAL_Y = RFPercentage(30);
const POSITION_FAKED_X = -widthPercentage(0.075);

const USER_SCREENS = [
  {
    name: SCREENS.Home,
    fillIcon: icons.Play,
    emptyIcon: icons.Play,
    event: eventlisteners.HOME_SCREEN,
  },
  {
    name: "Events",
    icon: icons.Cocktail,
    fillIcon: require("../../assets/icons/cocktail_fill.png"),
    emptyIcon: require("../../assets/icons/cocktail_empty.png"),
    event: eventlisteners.EVENT_MOMENTS,
  },
  {
    name: "add",
    icon: icons.Marker1,
    fillIcon: require("../../assets/icons/marker_fill.png"),
    emptyIcon: require("../../assets/icons/marker_empty.png"),
    event: eventlisteners.VENUE_SCREEN,
  },
  {
    name: SCREENS.Chat,
    fillIcon: require("../../assets/icons/paperplane_fill.png"),
    emptyIcon: require("../../assets/icons/paperplane_empty.png"),
  },
  {
    name: SCREENS.Profile,
    fillIcon: require("../../assets/icons/profile_fill.png"),
    emptyIcon: require("../../assets/icons/profile_empty.png"),
  },
];

const BUSINESS_SCREENS = [
  {
    name: SCREENS.Home,
    fillIcon: require("../../assets/icons/cocktail_fill.png"),
    emptyIcon: require("../../assets/icons/cocktail_empty.png"),
  },
  {
    name: SCREENS.MyMoment,
    fillIcon: require("../../assets/icons/posts_fill.png"),
    emptyIcon: require("../../assets/icons/posts_empty.png"),
  },
  {
    name: "add",
  },
  {
    name: SCREENS.Chat,
    fillIcon: require("../../assets/icons/paperplane_fill.png"),
    emptyIcon: require("../../assets/icons/paperplane_empty.png"),
  },
  {
    name: SCREENS.BusinessProfile,
    fillIcon: require("../../assets/icons/gear_fill.png"),
    emptyIcon: require("../../assets/icons/gear_empty.png"),
  },
];

const BottomTabBar = ({
  scrollX,
  states,
  onPress,
  onCurrentEventPress,
  componentId,
}) => {
  const { selected, setSelected } = states;
  const { isBusiness, hasMultipleBusinesses } = useCurrentBusiness();

  const { isConnected } = useReachability();

  const theme = useTheme();
  const dispatch = useDispatch();

  const { isPositionFaked } = useUser();

  const messagesCount = useSelector(getUnreadChatCount);
  const { feedsCountTotal } = useMyFeeds();

  const addIcon = icons.Add;

  const onTabPress = ({ index }) => {
    setSelected(index);
    onPress(index);
  };

  const onLongPress = ({ index }) => {
    if (!isBusiness && index == 4) {
      showSheetNavigation({
        screen: SCREENS.ProfileStuffs,
        passProps: { pushComponentId: componentId },
      });
    }

    if (isBusiness && hasMultipleBusinesses) {
      showSheetNavigation({ screen: SCREENS.MyProfilesList });
    }
  };

  const onAdjancetButtonPress = () => {
    if (isBusiness) {
      showModalNavigation({
        screen: SCREENS.QrScanner,
      });
    } else {
      dispatch(setUserPosition(null));
    }
  };

  const onAddButtonPress = () => {
    if (isBusiness) {
      showStackModal({
        screen: SCREENS.CreateEvent,
        fullscreen: true,
      });
    } else {
      showStackModal({
        screen: SCREENS.CreateMoment,
        fullscreen: true,
      });
    }
  };

  /* Styles */

  const animatedStyle = useAnimatedStyle(() => {
    if (isBusiness) {
      return {};
    }

    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [0, width, width * 2],
            [width, 0, -width],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  }, [isBusiness]);

  const contentStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.content,
    };
  }, [isBusiness]);

  const buttonProps = useMemo(() => {
    return {
      activeScale: 0.9,
      tension: 200,
      friction: 10,
      style: styles.iconContainer,
    };
  }, []);

  return (
    <FadeAnimatedView style={[{ bottom: 0 }, animatedStyle]}>
      {/* <CurrentEventView onPress={onCurrentEventPress} /> */}

      <LinearGradientView
        colors={gradients.DarkVanishing}
        style={styles.gradientContainer}
      >
        <MotiView
          transition={{ damping: 16 }}
          from={{ translateY: INITIAL_Y }}
          animate={{
            translateY: isConnected ? 20 : -8,
            translateX: isPositionFaked ? POSITION_FAKED_X : 0,
          }}
          style={styles.row}
        >
          <View style={contentStyle}>
            {(isBusiness ? BUSINESS_SCREENS : USER_SCREENS).map(
              ({ name, icon, event, inset, emptyIcon, fillIcon }, index) => {
                if (name == "add") {
                  return (
                    <AddPostButton
                      key="add"
                      icon={addIcon}
                      enabled={isConnected}
                      onPress={onAddButtonPress}
                    />
                  );
                }

                const isSelected = index == selected;

                const color = isSelected
                  ? theme.colors.main_accent
                  : theme.colors.text;

                return (
                  <TouchableScale
                    key={index}
                    activeScale={1}
                    {...buttonProps}
                    delayLongPress={250}
                    onLongPress={() => onLongPress({ index })}
                    onPress={() => {
                      onTabPress({ index, name });

                      if (event && index == selected) {
                        EventRegister.emit(event);
                      }
                    }}
                  >
                    {/* {!isBusiness && index == 0 && selected == 0 ? (
                      <AddPostButton enabled={isConnected} />
                    ) : (
                      <ScaleAnimatedView disabled={index !== 0}> */}
                    <View style={styles.iconContent}>
                      <View style={{ opacity: isSelected ? 0 : 1 }}>
                        <SquareImage
                          inset={inset}
                          source={icon ?? emptyIcon}
                          side={ICON_SIDE}
                        />
                      </View>

                      <MotiView
                        style={{
                          opacity: isSelected ? 1 : 0,
                          position: "absolute",
                        }}
                        from={{ scale: 0.8 }}
                        animate={{ scale: isSelected ? 1 : 0.8 }}
                      >
                        <SquareImage
                          inset={inset}
                          source={fillIcon}
                          side={ICON_SIDE}
                          color={color}
                        />
                      </MotiView>
                    </View>
                    {/* </ScaleAnimatedView>
                    )} */}

                    {index == 3 && <BadgeCountView count={messagesCount} />}
                    {index == 4 && (
                      <BadgeCountView
                        count={isBusiness ? 0 : feedsCountTotal}
                      />
                    )}
                  </TouchableScale>
                );
              }
            )}
          </View>

          {isPositionFaked && (
            <AdjacentTabBarButton
              icon={icons.MyLocation}
              iconSize={ICON_SIZES.three}
              onPress={onAdjancetButtonPress}
            />
          )}
        </MotiView>

        <ReachabilityView isConnected={isConnected} />
      </LinearGradientView>
    </FadeAnimatedView>
  );
};

export default memo(BottomTabBar);

const styles = StyleSheet.create({
  gradientContainer: {
    bottom: 0,
    position: "absolute",
    width: "100%",
    zIndex: 10,
    paddingBottom: insets.bottom,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  iconContainer: {
    width: ICON_CONTAINER_SIDE,
    height: ICON_CONTAINER_SIDE,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  content: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: BORDER_RADIUS * 1.5,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
