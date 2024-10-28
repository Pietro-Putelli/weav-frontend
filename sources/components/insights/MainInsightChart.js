import LineGraph from "@chartiful/react-native-line-graph";
import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { dateFormats } from "../../dates";
import { formatDate } from "../../dates/formatters";
import { useLanguages, useTheme } from "../../hooks";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { fonts } from "../../styles";

const { width, height } = Dimensions.get("window");
const CHART_WIDTH = width - 50;
const CHART_HEIGHT = height / 4;

const MainInsightChart = ({
  title,
  description,
  icon,
  insight,
  datePeriod,
}) => {
  const theme = useTheme();
  const { languageContent, getPluralAwareWord } = useLanguages();

  const { values, values_total } = insight;

  const baseConfig = useMemo(() => {
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

  const { from, to } = useMemo(() => {
    const format = dateFormats.MMM_DD;

    return {
      from: formatDate({
        date: datePeriod.from,
        format: format,
      }),
      to: formatDate({
        date: datePeriod.to,
        format,
      }),
    };
  }, [datePeriod]);

  return (
    <>
      <View style={[styles.container, theme.styles.shadow]}>
        <LineGraph
          isBezier
          data={values}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          baseConfig={baseConfig}
          dotColor={theme.white_alpha(0.8)}
          lineColor={theme.colors.main_accent}
        />

        <View style={[styles.period_container]}>
          <View style={styles.from_text}>
            <MainText capitalize bold font="subtitle-1">
              {from}
            </MainText>
          </View>

          <View style={styles.to_text}>
            <MainText capitalize bold font="subtitle-1">
              {to}
            </MainText>
          </View>
        </View>
      </View>

      <View style={[styles.count_container, theme.styles.shadow_round]}>
        <SquareImage side={ICON_SIZES.three} source={icon} />
        <MainText style={{ marginLeft: "4%", flex: 1 }} font="subtitle">
          {description ??
            `${values_total} ${getPluralAwareWord({
              word: title,
              count: values_total,
            })} ${languageContent.in_this_period}`}
        </MainText>
      </View>
    </>
  );
};

export default memo(MainInsightChart);

const styles = StyleSheet.create({
  container: {
    paddingTop: "8%",
    paddingBottom: "4%",
    alignItems: "center",
  },
  period_container: {
    marginTop: "6%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  from_text: {
    flex: 1,
  },
  to_text: {
    flex: 1,
    alignItems: "flex-end",
  },
  count_container: {
    padding: 16,
    marginTop: "3%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
