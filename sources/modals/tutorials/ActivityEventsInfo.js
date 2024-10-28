import React from "react";
import { View } from "react-native";
import { MainText } from "../../components/texts";
import { useLanguages } from "../../hooks";
import { SquareImage } from "../../components/images";
import { icons } from "../../styles";

const ActivityEventsInfo = () => {
  const { languageContent } = useLanguages();

  return (
    <View style={{ marginBottom: "4%", alignItems: "center" }}>
      <View
        style={{
          marginTop: "5%",
          marginBottom: "8%",
        }}
      >
        <SquareImage percentage={3} source={icons.ColoredSpots} coloredIcon />
      </View>

      <MainText font="subtitle">{languageContent.weav_events}</MainText>
    </View>
  );
};

export default ActivityEventsInfo;
