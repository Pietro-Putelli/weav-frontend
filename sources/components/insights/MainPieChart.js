import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import LegendaItem from "./LegendaItem";
import PieChart from "react-native-pie-chart";
import { useTheme } from "../../hooks";
import { widthPercentage } from "../../styles/sizes";

const widthAndHeight = widthPercentage(0.25);

const MainPieChart = ({ style, data, children }) => {
  const theme = useTheme();

  const { values, slices } = data;

  const colors = useMemo(() => {
    return [theme.colors.main_accent, theme.colors.main_accent_a];
  }, []);

  return (
    <View style={[theme.styles.shadow_round, styles.container, style]}>
      {children && <View style={styles.header}>{children}</View>}

      <View style={styles.content}>
        <PieChart
          doughnut={true}
          coverRadius={0.6}
          series={values}
          sliceColor={colors}
          widthAndHeight={widthAndHeight}
          coverFill={theme.colors.second_background}
        />

        <View style={styles.legenda}>
          {slices.map(({ title }, index) => {
            return (
              <LegendaItem key={index} title={title} color={colors[index]} />
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default memo(MainPieChart);

const styles = StyleSheet.create({
  container: {
    padding: "4%",
    marginTop: "3%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: "6%",
  },
  legenda: {
    marginLeft: "8%",
  },
});
