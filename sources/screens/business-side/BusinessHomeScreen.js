import React, { useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { FadeAnimatedView } from "../../components/animations";
import { SolidButton } from "../../components/buttons";
import { SingleTitleCell } from "../../components/cells";
import { AnimatedScrollView } from "../../components/containers";
import { BusinessHomeHeader } from "../../components/headers";
import { BusinessApprovationPlaceholder } from "../../components/placeholders";
import { SeparatorTitle } from "../../components/separators";
import { MainText } from "../../components/texts";
import { VenueEventsPreviewList } from "../../components/venue";
import { BounceView } from "../../components/views";
import { SCREENS } from "../../constants/screens";
import {
  useCurrentBusiness,
  useLanguages,
  useMyBusinessEvents,
  useTheme,
} from "../../hooks";
import {
  pushNavigation,
  showSheetNavigation,
  showStackModal,
} from "../../navigation/actions";
import { icons, insets } from "../../styles";
import {
  formatBusinessPreview,
  formatBusinessRankingTitle,
} from "../../utility/formatters";
import { TAB_BAR_HEIGHT } from "../../styles/sizes";

const { height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.25;

const inputRange = [HEADER_HEIGHT * 0.3, HEADER_HEIGHT * 0.55];

const BusinessHomeScreen = ({ onChangeTab, componentId }) => {
  /* States */

  const { business, isBusinessApproved, isRefreshing, refreshBusiness } =
    useCurrentBusiness({ reqBusiness: true });

  const businessRanking = business?.ranking;

  const { events, refrehsEvents } = useMyBusinessEvents();

  /* Utility */

  const theme = useTheme();
  const scrollY = useSharedValue(0);
  const { languageContent } = useLanguages();

  /* Callbacks */

  const onEditPress = () => {
    showStackModal({ screen: SCREENS.EditBusiness });
  };

  const onPreviewPress = useCallback(() => {
    const businessPreview = formatBusinessPreview(business);

    pushNavigation({
      componentId,
      screen: SCREENS.VenueDetail,
      passProps: { preview: businessPreview },
    });
  }, [business]);

  const onInsightsPress = useCallback(() => {
    pushNavigation({
      componentId,
      screen: SCREENS.BusinessInsight,
    });
  }, []);

  const onRefresh = useCallback(() => {
    refreshBusiness();

    refrehsEvents();
  }, []);

  const onSharePress = () => {
    showSheetNavigation({
      screen: SCREENS.BusinessShare,
    });
  };

  /* Styles */

  const containerStyle = useMemo(() => {
    return [styles.container, { backgroundColor: theme.colors.background }];
  }, []);

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

  return (
    <AnimatedScrollView
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      scrollY={scrollY}
    >
      <Animated.View
        style={[animatedNavigationBarStyle, styles.navigationContainer]}
      >
        <Animated.View
          style={[styles.navigationTitle, animatedNavigationTitleStyle]}
        >
          <MainText numberOfLines={1} font="title-7">
            {business.name}
          </MainText>
        </Animated.View>
      </Animated.View>

      <BusinessHomeHeader scrollY={scrollY} business={business} />

      <View style={containerStyle}>
        {isBusinessApproved ? (
          <FadeAnimatedView style={styles.content}>
            {businessRanking && (
              <View style={styles.rankContainer}>
                <BounceView onPress={onInsightsPress}>
                  <MainText
                    bold
                    font="subtitle"
                    style={{ color: theme.colors.aqua }}
                  >
                    {formatBusinessRankingTitle(business)}
                  </MainText>
                </BounceView>
              </View>
            )}

            <View style={{ marginTop: "4%" }}>
              <SolidButton
                haptic
                type="done"
                title={languageContent.buttons.share_business}
                icon={icons.ShareOutside}
                flex
                onPress={onSharePress}
              />
            </View>

            <View style={{ marginTop: "4%" }}>
              <VenueEventsPreviewList
                events={events}
                business={business}
                componentId={componentId}
              />
            </View>

            <SeparatorTitle noBottom marginTop>
              {languageContent.profile}
            </SeparatorTitle>

            <SingleTitleCell
              onPress={onEditPress}
              title={languageContent.edit_business}
              icon={icons.Edit}
            />

            <SingleTitleCell
              onPress={onInsightsPress}
              title={languageContent.check_out_insights}
              icon={icons.Insight}
            />

            <SingleTitleCell
              onPress={onPreviewPress}
              title={languageContent.business_preview}
              icon={icons.EyeShow}
            />
          </FadeAnimatedView>
        ) : (
          <FadeAnimatedView style={{ marginTop: 8 }}>
            <SingleTitleCell
              icon={icons.Edit}
              onPress={onEditPress}
              title={languageContent.edit_business}
            />

            <SingleTitleCell
              onPress={onPreviewPress}
              title={languageContent.business_preview}
              icon={icons.EyeShow}
            />

            <BusinessApprovationPlaceholder onChangeTab={onChangeTab} />
          </FadeAnimatedView>
        )}
      </View>
    </AnimatedScrollView>
  );
};

export default BusinessHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  navigationContainer: {
    width: "100%",
    position: "absolute",
    zIndex: 2,
    paddingTop: insets.top,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  rankContainer: {
    marginTop: 4,
    marginLeft: 6,
  },
  content: { marginBottom: TAB_BAR_HEIGHT + 24 },
});
