import React, { memo } from "react";
import Animated, { SlideInRight } from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { IconButton } from "../buttons";
import { MainText } from "../texts";

const BusinessTipsCell = ({ children }) => {
  const theme = useTheme();

  return (
    <Animated.View
      exiting={SlideInRight}
      style={[
        {
          marginTop: "3%",
          alignItems: "center",
          flexDirection: "row",
          paddingVertical: 16,
          paddingHorizontal: 16,
        },
        theme.styles.shadow_round,
      ]}
    >
      <MainText style={{ flex: 1 }} font="subtitle">
        {children}
      </MainText>
      <IconButton side={"four"} source={icons.Cross} />
    </Animated.View>
  );
};

export default memo(BusinessTipsCell);
