import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { FadeAnimatedView } from "../../components/animations";
import {
  FriendButton,
  IconButton,
  SolidButton,
} from "../../components/buttons";
import { AnimatedScrollView } from "../../components/containers";
import { CacheableImageView, SquareImage } from "../../components/images";
import { PostPlaceholder } from "../../components/placeholders";
import { PostsList } from "../../components/posts";
import {
  MyProfileRightComponent,
  ProfileFriendsView,
} from "../../components/profile";
import { SeparatorTitle } from "../../components/separators";
import { MainText } from "../../components/texts";
import { BounceView, LoaderView } from "../../components/views";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import {
  useLanguages,
  useProfiles,
  useTheme,
  useUser,
  useUserPosts,
} from "../../hooks";
import {
  pushNavigation,
  showModalNavigation,
  showSheetNavigation,
  showStackModal,
} from "../../navigation/actions";
import { gradients, icons, insets } from "../../styles";
import { ICON_SIZES, TAB_BAR_HEIGHT } from "../../styles/sizes";
import { isNullOrUndefined } from "../../utility/boolean";
import { getHostnameFromRegex } from "../../utility/functions";
import { openInstagram } from "../../utility/linking";
import { isNullOrEmpty } from "../../utility/strings";
import { size } from "lodash";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.35;

const LINK_ICON_SIDE = ICON_SIZES.four;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const ProfileScreen = ({
  user,
  screenPaddingBottom,
  componentId,
  isFromChat,
}) => {
  const { profile } = useProfiles({ user });
  const userId = profile?.id ?? 0;

  const { amI } = useUser({ userId });

  const bio = profile?.bio ?? "";
  const friends = profile?.friends ?? [];

  const userInstagram = profile?.instagram;
  const userLink = getHostnameFromRegex(profile?.link);

  const hasInstagram = !isNullOrUndefined(userInstagram);
  const hasLink = !isNullOrUndefined(userLink);
  const hasLinks = hasInstagram || hasLink;

  const {
    posts,
    maxPostsReached,
    postsCount,
    isLoading,
    isNotFound,
    setIsNotFound,
  } = useUserPosts({ userId });

  /* Utility */

  const theme = useTheme();
  const scrollY = useSharedValue(0);

  const { languageContent } = useLanguages();
  const navigation = useNavigation();

  const { editingCount, hasBio } = useMemo(() => {
    const hasBio = !isNullOrEmpty(bio);
    const hasInstagram = !isNullOrEmpty(userInstagram);

    let count = 0;

    if (amI) {
      if (!hasBio) {
        count += 1;
      }

      if (!hasInstagram) {
        count += 1;
      }
    }

    return { editingCount: count, hasBio };
  }, [bio, userInstagram]);

  /* Callback */

  const onInstagramPress = () => {
    openInstagram(userInstagram);
  };

  const onLinkPress = () => {
    showModalNavigation({
      screen: SCREENS.Web,
      passProps: { isModal: true, url: userLink },
    });
  };

  const onAddPostPress = () => {
    showStackModal({ screen: SCREENS.EditUserPost });
  };

  const onEditProfilePress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.EditProfile,
    });
  };

  const onMorePress = () => {
    showSheetNavigation({
      screen: SCREENS.MenuModal,
      passProps: {
        type: actiontypes.MENU_MODAL.USER_PROFILE,
        profile,
      },
    });
  };

  const onMessagePress = () => {
    if (isFromChat) {
      navigation.pop();
      return;
    }

    pushNavigation({
      componentId,
      screen: SCREENS.ChatMessage,
      passProps: {
        receiver: profile,
        popOnPress: true,
      },
    });
  };

  const onBackPress = () => {
    navigation.pop();
  };

  const onPostLongPress = useCallback(
    (post) => {
      if (amI) {
        showSheetNavigation({
          screen: SCREENS.MenuModal,
          passProps: {
            type: actiontypes.MENU_MODAL.EDIT_POST,
            props: {
              post,
              onDeleted: () => {
                if (postsCount == 1) {
                  setIsNotFound(true);
                }
              },
            },
          },
        });
      }
    },
    [postsCount]
  );

  const onPostPress = useCallback(
    (index) => {
      showStackModal({
        screen: SCREENS.UserPosts,
        isTransparent: true,
        passProps: { userId, userName: profile.name, initialIndex: index },
      });
    },
    [profile]
  );

  /* Styles */

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1.1, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
      top: scrollY.value / 2,
    };
  });

  const inputRange = [HEADER_HEIGHT * 0.4, HEADER_HEIGHT * 0.65];

  const animatedNavigationBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      top: scrollY.value,
      backgroundColor: `rgba(9,6,22,${opacity})`,
    };
  });

  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, height / 4],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const animatedNavigationTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        inputRange,
        [0, 1],
        Extrapolate.CLAMP
      ),
      bottom: interpolate(
        scrollY.value,
        inputRange,
        [-10, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const containerStyle = useMemo(() => {
    return [{ backgroundColor: theme.colors.background }, styles.container];
  }, []);

  const paddingBottom = useMemo(() => {
    let paddingBottom = insets.bottom;

    if (amI) {
      if (screenPaddingBottom) {
        if (postsCount <= 2) {
          paddingBottom = screenPaddingBottom - TAB_BAR_HEIGHT + insets.bottom;
        } else {
          paddingBottom = screenPaddingBottom;
        }
      } else {
        paddingBottom = postsCount >= 2 ? TAB_BAR_HEIGHT : 160;
      }
    }

    return paddingBottom + 16 + (size(bio) > 40 ? 16 : 0);
  }, [postsCount, screenPaddingBottom]);

  const renderPlaceholder = useCallback(() => {
    return <PostPlaceholder />;
  }, []);

  return (
    <FadeAnimatedView disabled={!amI}>
      <AnimatedScrollView
        scrollY={scrollY}
        contentContainerStyle={{ paddingBottom }}
      >
        <Animated.View
          style={[animatedNavigationBarStyle, styles.navigationContainer]}
        >
          <AnimatedLinearGradient
            colors={gradients.Shadow}
            style={[styles.gradient, animatedGradientStyle]}
          />

          <View style={styles.navigationContent}>
            {!amI && (
              <IconButton
                inset={3}
                onPress={onBackPress}
                side={ICON_SIZES.two}
                style={{ marginRight: 4 }}
                source={icons.Chevrons.Left}
              />
            )}

            <Animated.View
              style={[styles.navigationTitle, animatedNavigationTitleStyle]}
            >
              <MainText numberOfLines={1} font="title-6">
                {profile.name}
              </MainText>
            </Animated.View>

            {amI ? (
              <MyProfileRightComponent componentId={componentId} />
            ) : (
              <IconButton
                inset={2}
                source={icons.More}
                onPress={onMorePress}
                side={ICON_SIZES.two}
              />
            )}
          </View>
        </Animated.View>

        <View style={styles.header}>
          <Animated.View style={[animatedHeaderStyle]}>
            <CacheableImageView source={profile.picture} style={styles.image} />
          </Animated.View>

          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.usernameGradient}
            colors={gradients.Profile}
          >
            <FadeAnimatedView mode="fade">
              <MainText bold numberOfLines={1} font="title-3">
                {profile.name}
              </MainText>
            </FadeAnimatedView>
          </LinearGradient>
        </View>

        <View style={containerStyle}>
          <FadeAnimatedView>
            <View
              style={[
                styles.usernameContainer,
                { marginBottom: hasBio || hasLinks ? 0 : 8 },
              ]}
            >
              <MainText
                numberOfLines={1}
                font="subtitle-2"
                style={styles.usernameTitle}
                color={theme.colors.secondText}
              >
                @{profile.username}
              </MainText>

              <ProfileFriendsView friends={friends} componentId={componentId} />
            </View>

            <View
              style={[
                styles.bioContainer,
                { marginBottom: hasBio || hasLinks ? "4%" : 0 },
              ]}
            >
              {hasBio && (
                <MainText
                  style={{
                    marginBottom: hasLinks ? 0 : "3%",
                  }}
                  font="subtitle-3"
                >
                  {profile.bio}
                </MainText>
              )}

              {hasLinks && (
                <View
                  style={[
                    styles.linksContainer,
                    { marginTop: hasBio ? "3%" : "1%" },
                  ]}
                >
                  {hasInstagram && (
                    <BounceView
                      onPress={onInstagramPress}
                      style={styles.linkItem}
                    >
                      <SquareImage
                        side={LINK_ICON_SIDE}
                        source={icons.Instagram}
                      />
                      <MainText
                        bold
                        font="subtitle-3"
                        style={{ marginHorizontal: 8 }}
                      >
                        {userInstagram}
                      </MainText>
                    </BounceView>
                  )}

                  {hasLink && (
                    <BounceView onPress={onLinkPress} style={styles.linkItem}>
                      <SquareImage side={LINK_ICON_SIDE} source={icons.Link} />
                      <MainText
                        font="subtitle-3"
                        bold
                        style={{ marginHorizontal: 8 }}
                      >
                        {userLink}
                      </MainText>
                    </BounceView>
                  )}
                </View>
              )}
            </View>

            <View style={styles.buttons}>
              {amI ? (
                <>
                  {!maxPostsReached && (
                    <SolidButton
                      flex
                      type="done"
                      marginRight
                      icon={icons.Add}
                      onPress={onAddPostPress}
                      title={languageContent.buttons.new_post}
                    />
                  )}
                  <SolidButton
                    flex
                    count={editingCount}
                    onPress={onEditProfilePress}
                    title={languageContent.buttons.edit_profile}
                  />
                </>
              ) : (
                <>
                  <FriendButton user={profile} />

                  <SolidButton
                    flex
                    title={languageContent.buttons.message}
                    style={{ marginLeft: 8 }}
                    icon={icons.Paperplane}
                    onPress={onMessagePress}
                  />
                </>
              )}
            </View>

            <View style={styles.contentContainer}>
              <SeparatorTitle marginTop>posts</SeparatorTitle>

              {!isLoading ? (
                <PostsList
                  posts={posts}
                  onPress={onPostPress}
                  isNotFound={isNotFound}
                  onLongPress={onPostLongPress}
                  renderPlaceholder={renderPlaceholder}
                />
              ) : (
                <FadeAnimatedView mode="fade" style={styles.loaderContainer}>
                  <LoaderView percentage={0.8} />
                </FadeAnimatedView>
              )}
            </View>
          </FadeAnimatedView>
        </View>
      </AnimatedScrollView>
    </FadeAnimatedView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    width,
    height: HEADER_HEIGHT,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  navigationContainer: {
    width,
    position: "absolute",
    zIndex: 2,
  },
  navigationContent: {
    flex: 1,
    paddingTop: insets.top,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingLeft: 10,
    paddingBottom: 12,
  },
  container: {
    paddingTop: 12,
    paddingHorizontal: 12,
    minHeight: height * 0.6,
  },
  usernameTitle: {
    marginTop: -20,
    marginLeft: 2,
    marginBottom: "2%",
  },
  navigationTitle: {
    flex: 1,
  },
  linksContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
  },
  linkItem: {
    marginTop: 8,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    marginHorizontal: -6,
  },
  gradient: {
    width,
    height: "150%",
    position: "absolute",
  },
  bioContainer: {
    marginHorizontal: 4,
  },
  usernameContainer: {
    flexDirection: "row",
    alignContent: "center",
  },
  contentContainer: {
    marginHorizontal: -4,
  },
  loaderContainer: {
    marginTop: "4%",
    alignItems: "center",
    justifyContent: "center",
  },
  usernameGradient: {
    height: HEADER_HEIGHT / 2,
    width: "100%",
    position: "absolute",
    bottom: 0,
    marginBottom: 0,
    justifyContent: "flex-end",
    padding: 8,
    paddingLeft: 10,
  },
});
