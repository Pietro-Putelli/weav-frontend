import React, { memo, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks";
import { useDispatch } from "react-redux";
import EventsAPI from "../../backend/events";
import { FadeAnimatedView } from "../../components/animations";
import { SolidButton } from "../../components/buttons";
import { MainScrollView } from "../../components/containers";
import { EventCoverPreview, SquareImage } from "../../components/images";
import { SeparatorTitle } from "../../components/separators";
import { MainText } from "../../components/texts";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useMyBusinessEvents, useTheme } from "../../hooks";
import { showSheetNavigation, showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { formatLargeNumber } from "../../utility/formatters";

const BusinessEventPreviewScreen = ({ eventId }) => {
  const { event, insights, isLoading, isRefreshing, refreshInsights } =
    useMyBusinessEvents({ eventId, showInsights: true });

  /* Utility */

  const { languageContent } = useLanguages();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  /* Props */

  const headerProps = useMemo(() => {
    return { title: event?.title };
  }, [event]);

  const { repostsCount, participantsCount, sharesCount } = useMemo(() => {
    const repostsCount = insights?.reposts_count ?? 0;
    const participantsCount = insights?.participants_count ?? 0;
    const sharesCount = insights?.shares_count ?? 0;

    return {
      repostsCount: formatLargeNumber(repostsCount),
      participantsCount: formatLargeNumber(participantsCount),
      sharesCount: formatLargeNumber(sharesCount),
    };
  }, [insights]);

  /* Callbacks */

  const onDeleted = () => {
    dispatch(
      EventsAPI.deleteBusinessEvent(eventId, (isDone) => {
        if (isDone) {
          navigation.pop();
        }
      })
    );
  };

  const onMorePress = useCallback(() => {
    showSheetNavigation({
      screen: SCREENS.MenuModal,
      passProps: {
        type: actiontypes.MENU_MODAL.EVENT_MOMENT_OPTIONS,
        onDeleted,
      },
    });
  }, []);

  const onEditPress = () => {
    showStackModal({ screen: SCREENS.CreateEvent, passProps: { eventId } });
  };

  /* Components */

  const renderBottomContent = useCallback(() => {
    return (
      <View style={{ flexDirection: "row" }}>
        <SolidButton
          // marginRight
          onPress={onEditPress}
          flex
          title="edit"
          icon={icons.Edit}
        />

        {/* <SolidButton
          flex
          type="done"
          title="share"
          onPress={onSharePress}
          icon={icons.ShareOutside}
        /> */}
      </View>
    );
  }, []);

  if (!event) {
    return null;
  }

  return (
    <MainScrollView
      {...headerProps}
      isLoading={isLoading}
      rightIcon={icons.More}
      onRightPress={onMorePress}
      refreshing={isRefreshing}
      onRefresh={refreshInsights}
      contentStyle={styles.scrollContent}
      renderBottomContent={renderBottomContent}
    >
      <EventCoverPreview disabledWithoutOpacity event={event} />

      <FadeAnimatedView style={styles.content}>
        <SeparatorTitle>{languageContent.insights}</SeparatorTitle>

        <View style={styles.insightsContainer}>
          <InsightCell
            marginRight
            icon={icons.Repost}
            value={repostsCount}
            title={languageContent.reposts}
          />
          <InsightCell
            marginRight
            icon={icons.Friends}
            value={participantsCount}
            title={languageContent.people}
          />

          <InsightCell
            value={sharesCount}
            icon={icons.ShareEmpty}
            title={languageContent.shares}
          />
        </View>
      </FadeAnimatedView>
    </MainScrollView>
  );
};

export default BusinessEventPreviewScreen;

const InsightCell = memo(({ title, icon, value, marginRight }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        theme.styles.shadow_round,
        styles.insightCell,
        { marginRight: marginRight ? "2%" : 0 },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SquareImage source={icon} side={ICON_SIZES.two * 0.9} />
        <View style={styles.insightTitle}>
          <MainText numberOfLines={1} font="title-6" uppercase bold>
            {value}
          </MainText>
        </View>
      </View>

      <MainText
        numberOfLines={1}
        align="center"
        style={{ marginTop: 4 }}
        font="subtitle-4"
        uppercase
      >
        {title}
      </MainText>
    </View>
  );
});

const styles = StyleSheet.create({
  content: {
    width: "100%",
    marginTop: "6%",
    paddingHorizontal: 12,
  },
  insightsContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  insightCell: {
    flex: 1,
    padding: "4%",
    alignItems: "center",
  },
  insightTitle: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollContent: {
    paddingTop: 8,
    alignItems: "center",
    paddingHorizontal: 0,
  },
});
