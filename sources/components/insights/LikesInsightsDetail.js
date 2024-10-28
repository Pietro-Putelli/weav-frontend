import React, { memo, useMemo } from "react";
import { useLanguages } from "../../hooks";
import { MainText } from "../texts";
import MainInsightChart from "./MainInsightChart";
import MainPieChart from "./MainPieChart";

/* Number of people, not profiles, who visit my venue in the selected period and number of total likes. */

const LikesInsightsDetail = ({ insight, ...props }) => {
  const { users_count, values_total } = insight;

  const { languageContent } = useLanguages();

  const userLikesPercentage = useMemo(() => {
    return Math.round((values_total / users_count) * 100);
  }, [insight]);

  const data = useMemo(() => {
    return {
      values: [userLikesPercentage, 100 - userLikesPercentage],
      slices: [
        { title: languageContent.liked },
        { title: languageContent.not_liked },
      ],
    };
  }, [userLikesPercentage]);

  return (
    <>
      <MainInsightChart insight={insight} {...props} />

      {users_count > 0 && (
        <MainPieChart data={data}>
          <MainText align="center" font="subtitle-1">
            {users_count}{" "}
            {
              languageContent[
                users_count == 1
                  ? "person_visit_profile"
                  : "people_visit_profile"
              ]
            }{" "}
            {userLikesPercentage}% {languageContent.liked_it}
          </MainText>
        </MainPieChart>
      )}
    </>
  );
};

export default memo(LikesInsightsDetail);
