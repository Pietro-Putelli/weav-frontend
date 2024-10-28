import React, { useCallback, useMemo } from "react";
import { FadeAnimatedView } from "../../components/animations";
import { InsightIconCell } from "../../components/cells";
import { MainScrollView } from "../../components/containers";
import { DateLabel, PopularityIndexView } from "../../components/insights";
import { SeparatorTitle } from "../../components/separators";
import { insights } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useBusinessInsights, useLanguages } from "../../hooks";
import { showModalNavigation } from "../../navigation/actions";
import { icons } from "../../styles";

const { INSIGHT_ACTIONS } = insights;

const BusinessInsightsScreen = ({ componentId }) => {
  const {
    insightsPeriod,
    insightsOverview,
    refreshOverview,
    onChangeInsightsPeriod,
    isRefreshing,
    isLoading,
  } = useBusinessInsights({ isOverview: true });

  const { languageContent } = useLanguages();

  const isLoadingInsights = !insightsOverview || isLoading;

  const insightCases = useMemo(() => {
    const { reposts, shares, likes, profile_visits, summary } = languageContent;

    const titles = [reposts, shares, likes, profile_visits, summary];

    return INSIGHT_ACTIONS.map((insight, index) => {
      return {
        ...insight,
        title: titles[index],
      };
    });
  }, []);

  /* Callbacks */

  const onRefresh = useCallback(() => {
    refreshOverview();
  }, [refreshOverview]);

  const onInfoPress = useCallback(() => {
    showModalNavigation({ screen: SCREENS.InsightInfo });
  }, []);

  return (
    <MainScrollView
      title={languageContent.insights}
      onRefresh={onRefresh}
      isLoading={isLoadingInsights}
      refreshing={isRefreshing}
      onRightPress={onInfoPress}
      rightIcon={icons.Info}
    >
      <FadeAnimatedView>
        <PopularityIndexView overview={insightsOverview} />

        <SeparatorTitle>{languageContent.select_period}</SeparatorTitle>

        <DateLabel
          data={insightsPeriod}
          onDatePicked={onChangeInsightsPeriod}
        />

        <SeparatorTitle marginTop noBottom>
          {languageContent.overview}
        </SeparatorTitle>

        {insightCases.map((insight, index) => {
          return (
            <InsightIconCell
              key={index}
              componentId={componentId}
              overview={insightsOverview}
              {...insight}
            />
          );
        })}
      </FadeAnimatedView>
    </MainScrollView>
  );
};

export default BusinessInsightsScreen;
