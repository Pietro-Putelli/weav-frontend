import React, { memo, useMemo } from "react";
import { View } from "react-native";
import { useLanguages } from "../../hooks";
import MainInsightChart from "./MainInsightChart";

const ProfileVisitInsightDetail = ({ insight, ...props }) => {
  const { values_total } = insight;

  const { languageContent, getPluralAwareWord } = useLanguages();

  const description = useMemo(() => {
    return `${
      languageContent.profile_has_been_visited
    } ${values_total} ${getPluralAwareWord({
      word: "time",
      count: values_total,
    })} ${languageContent.times_in_this_period}`;
  }, [insight]);

  return (
    <View>
      <MainInsightChart
        description={description}
        insight={insight}
        {...props}
      />
    </View>
  );
};

export default memo(ProfileVisitInsightDetail);
