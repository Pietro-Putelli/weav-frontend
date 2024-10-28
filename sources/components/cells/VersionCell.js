import React, { memo } from "react";
import { View } from "react-native";
import { MainText } from "../texts";

const VersionCell = () => {
  return (
    <View
      style={{
        alignSelf: "center",
        alignItems: "center",
        marginTop: "4%",
      }}
    >
      <MainText font="subtitle-4" uppercase bold>
        Version 1.0
      </MainText>
    </View>
  );
};

export default memo(VersionCell);
