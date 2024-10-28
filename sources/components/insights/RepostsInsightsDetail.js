import React, { memo, useMemo } from "react";
import { View } from "react-native";
import { useLanguages } from "../../hooks";
import { MainText } from "../texts";
import MainInsightChart from "./MainInsightChart";
import MainPieChart from "./MainPieChart";

const RepostsInsightsDetail = ({ insight, ...props }) => {
  const { business_count, event_count, values_total } = insight;

  const { languageContent } = useLanguages();

  const data = useMemo(() => {
    return {
      values: [business_count, event_count],
      slices: [
        { title: languageContent.venue_reposts },
        { title: languageContent.event_reposts },
      ],
    };
  }, []);

  return (
    <View>
      <MainInsightChart insight={insight} {...props} />

      {values_total > 0 && (
        <MainPieChart data={data}>
          <MainText align="center" font="subtitle-1">
            {business_count}{" "}
            {
              languageContent[
                business_count == 1
                  ? "person_repost_business"
                  : "people_repost_business"
              ]
            }{" "}
            {event_count}{" "}
            {
              languageContent[
                event_count == 1 ? "person_repost_event" : "people_repost_event"
              ]
            }
          </MainText>
        </MainPieChart>
      )}
    </View>
  );
};

export default memo(RepostsInsightsDetail);
