import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useLanguages, useTheme } from "../../hooks";
import HorizontalBarGraph from "@chartiful/react-native-horizontal-bar-graph";
import LineGraph from "@chartiful/react-native-line-graph";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";
import { fonts } from "../../styles";

const { width, height } = Dimensions.get("window");
const DELTA = 60;
const CHART_WIDTH = width - DELTA;
const CHART_HEIGHT = height / 5;

const SummaryInsightsDetail = ({ insight }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const { reposts, shares, likes } = languageContent;

  const {
    reposts_count,
    shares_count,
    likes_count,
    interactions,
    interactions_count,
  } = insight;

  const values = [reposts_count, shares_count, likes_count];

  const allValuesAreZero = useMemo(() => {
    return values.reduce((partialSum, a) => partialSum + a, 0) == 0;
  }, [values]);

  const lineChartBaseConfig = useMemo(() => {
    return {
      xAxisLabelStyle: {
        color: theme.colors.text,
        fontFamily: fonts.Medium,
        fontWeight: "bold",
      },
      hasYAxisLabels: false,
      hasYAxisBackgroundLines: false,
      xAxisBackgroundLineStyle: {
        color: theme.white_alpha(0.1),
      },
    };
  }, []);

  const barChartBaseConfig = {
    hasYAxisBackgroundLines: false,
    xAxisLabelStyle: {
      fontSize: 13,
      decimals: 0,
      color: "white",
      width: width / 5,
      xOffset: -25,
      yOffset: 5,
      position: "left",
      fontFamily: fonts.Medium,
    },
    yAxisLabelStyle: {
      fontSize: 13,
      color: "white",
      yOffset: 15,
      decimals: 0,
      fontFamily: fonts.Medium,
    },
  };

  return (
    <View>
      {!allValuesAreZero && (
        <>
          <SeparatorTitle>
            {languageContent.interactions_by_type}
          </SeparatorTitle>

          <View style={[styles.horizontal_bar_container, theme.styles.shadow]}>
            <HorizontalBarGraph
              data={values}
              labels={[reposts, shares, likes].map((title) => {
                return title?.capitalize();
              })}
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
              barRadius={8}
              barWidthPercentage={0.6}
              baseConfig={barChartBaseConfig}
              barColor={theme.colors.main_accent}
            />
          </View>
        </>
      )}

      {interactions_count > 0 && (
        <>
          <SeparatorTitle marginTop={!allValuesAreZero}>
            {languageContent.total_interactions}
          </SeparatorTitle>

          <View
            style={[
              styles.total_interactions_container,
              theme.styles.shadow_round,
            ]}
          >
            <LineGraph
              isBezier
              data={interactions}
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
              baseConfig={lineChartBaseConfig}
              dotColor={theme.white_alpha(0.8)}
              lineColor={theme.colors.main_accent}
            />
          </View>

          <View style={[styles.title_container, theme.styles.shadow_round]}>
            <MainText font="subtitle-1" align={"center"}>
              {interactions_count}{" "}
              {languageContent.interactions_with_your_profile}
            </MainText>
          </View>
        </>
      )}
    </View>
  );
};

export default memo(SummaryInsightsDetail);

const styles = StyleSheet.create({
  horizontal_bar_container: {
    paddingTop: 16,
    paddingLeft: DELTA / 4,
    paddingBottom: 16,
    height: CHART_HEIGHT + 8,
  },
  total_interactions_container: {
    padding: "4%",
    paddingTop: "8%",
    justifyContent: "center",
    alignItems: "center",
  },
  title_container: {
    padding: "4%",
    marginTop: "3%",
  },
});
