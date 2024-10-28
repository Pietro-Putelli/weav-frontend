import { isNull } from "lodash";
import React, { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { CountUp } from "use-count-up";
import { MEDIA_DOMAIN } from "../../backend/endpoints";
import { useCurrentBusiness, useTheme } from "../../hooks";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const TITLE_FONT_SIZE = RFPercentage(8);

const PopularityIndexView = ({ overview }) => {
  const theme = useTheme();

  const { business, businessLocation } = useCurrentBusiness();

  const { overall_rank, category_rank } = overview;

  const businessCategory = business.category;

  const { categoryTitle, categoryIcon } = useMemo(() => {
    return {
      categoryTitle: businessCategory?.title,
      categoryIcon: {
        uri: `${MEDIA_DOMAIN}/utils/icons/${businessCategory?.icon}.png`,
      },
    };
  }, [businessCategory]);

  const rankTitleStyle = useMemo(() => {
    return {
      color: "white",
      fontWeight: "800",
      fontFamily: "Poppins",
      fontSize: TITLE_FONT_SIZE,
    };
  }, []);

  const rankCellStyle = useMemo(() => {
    return [styles.rank_cell, theme.styles.shadow_round];
  }, []);

  const textColorStyle = useMemo(() => {
    return { color: theme.colors.aqua };
  }, []);

  const subtitleProps = useMemo(() => {
    return {
      bold: true,
      font: "subtitle-3",
      uppercase: true,
    };
  }, []);

  if (isNull(overall_rank) || isNull(category_rank)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.overall_container}>
        <View style={[rankCellStyle, { marginRight: "2%" }]}>
          <Text style={[rankTitleStyle, textColorStyle]}>
            <MainText style={textColorStyle} font="title-6">
              #{" "}
            </MainText>
            <CountUp isCounting start={50} end={overall_rank} duration={0.5} />
          </Text>

          <MainText {...subtitleProps}>in {businessLocation.city}</MainText>
        </View>

        <View style={rankCellStyle}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[rankTitleStyle, styles.category_rank_title]}>
              <MainText font="title-6"># </MainText>
              <CountUp
                isCounting
                start={50}
                end={category_rank}
                duration={0.5}
              />
            </Text>
            <SquareImage
              coloredIcon
              side={ICON_SIZES.one}
              source={categoryIcon}
            />
          </View>

          <MainText {...subtitleProps}>{categoryTitle}</MainText>
        </View>
      </View>
    </View>
  );
};

export default memo(PopularityIndexView);

const styles = StyleSheet.create({
  container: {
    marginBottom: "4%",
  },
  overall_container: {
    flexDirection: "row",
  },
  rank_cell: {
    flex: 1,
    paddingTop: "2%",
    paddingBottom: "4%",
    alignItems: "center",
    justifyContent: "center",
  },
  category_rank: {
    padding: "3%",
    marginTop: "4%",
    flexDirection: "row",
    alignItems: "center",
  },
  category_rank_title: {
    marginRight: "4%",
  },
});
