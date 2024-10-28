import React, { memo } from "react";
import { View } from "react-native";
import { MainText } from "../texts";

const Username = ({ children }) => {
  return (
    <View style={{ marginBottom: 8 }}>
      <MainText bold font="subtitle-1">
        {children}
      </MainText>
    </View>
  );
};

export default memo(Username);
