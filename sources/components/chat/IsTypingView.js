import React, { memo } from "react";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { MainText } from "../texts";
import { LoaderView } from "../views";

const IsTypingView = ({ visible }) => {
  return visible ? (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={[
        {
          marginVertical: "2%",
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: "4%",
        },
      ]}
    >
      <LoaderView percentage={0.4} />
      <MainText
        bold
        font="subtitle-1"
        style={{ marginLeft: "2%", marginBottom: "1%" }}
      >
        Typing
      </MainText>
    </Animated.View>
  ) : null;
};

export default memo(IsTypingView);
