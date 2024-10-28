import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { FadeAnimatedView } from "../../components/animations";
import { MainScrollView } from "../../components/containers";
import {
  LikesInsightsDetail,
  MainInsightChart,
  ProfileVisitInsightDetail,
  RepostsInsightsDetail,
  SharesInsightsDetail,
  SummaryInsightsDetail,
} from "../../components/insights";
import { MainText } from "../../components/texts";
import { insights } from "../../constants";
import { useBusinessInsights, useLanguages, useTheme } from "../../hooks";

const { INSIGHT_TYPES } = insights;

const BusinessInsightDetailScreen = ({ title, type, icon }) => {
  /* States */
  const { datePeriod, insight, isValidInsight, isLoading } =
    useBusinessInsights({ type });

  /* Utility */

  const theme = useTheme();
  const { languageContent } = useLanguages();

  /* Props */

  const insightChartProps = useMemo(() => {
    return {
      insight,
      datePeriod,
      title,
      icon,
    };
  }, [insight, datePeriod]);

  const containerConfig = useMemo(() => {
    return { isLoading, title };
  }, [isLoading]);

  const renderContent = () => {
    switch (type) {
      case INSIGHT_TYPES.likes:
        return (
          <LikesInsightsDetail
            isValidInsight={isValidInsight}
            {...insightChartProps}
          />
        );
      case INSIGHT_TYPES.visits:
        return <ProfileVisitInsightDetail {...insightChartProps} />;
      case INSIGHT_TYPES.summary:
        return <SummaryInsightsDetail {...insightChartProps} />;
      case INSIGHT_TYPES.reposts:
        return <RepostsInsightsDetail {...insightChartProps} />;
      case INSIGHT_TYPES.shares:
        return <SharesInsightsDetail {...insightChartProps} />;
      default:
        return <MainInsightChart {...insightChartProps} />;
    }
  };

  return (
    <MainScrollView {...containerConfig}>
      <FadeAnimatedView>
        {!isValidInsight && (
          <View style={[styles.not_found_container, theme.styles.shadow_round]}>
            <MainText align="center" font="subtitle">
              {languageContent.no_insights_available}
            </MainText>
          </View>
        )}

        {isValidInsight && renderContent()}
      </FadeAnimatedView>
    </MainScrollView>
  );
};

export default BusinessInsightDetailScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: "6%",
    paddingBottom: "4%",
    alignItems: "center",
  },
  period_container: {
    marginTop: "3%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "4%",
  },
  from_text: {
    flex: 1,
  },
  to_text: {
    flex: 1,
    alignItems: "flex-end",
  },
  not_found_container: {
    padding: "4%",
    marginBottom: "3%",
  },
  loader_container: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  count_container: {
    padding: "4%",
    marginTop: "3%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
