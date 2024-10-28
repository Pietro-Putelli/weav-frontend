import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { MainText } from "../texts";

const SeparatorTitle = ({
  style,
  hairline,
  marginTop,
  marginLeft,
  noBottom,
  hairStyle,
  children,
}) => {
  const theme = useTheme();

  return (
    <View>
      {hairline && (
        <View
          style={[
            {
              width: "100%",
              marginVertical: 16,
              alignSelf: "center",
              height: StyleSheet.hairlineWidth,
              backgroundColor: theme.white_alpha(0.1),
            },
            hairStyle,
          ]}
        />
      )}

      <MainText
        bold
        font="subtitle-5"
        uppercase
        style={[
          {
            marginTop: marginTop ? 16 : 0,
            letterSpacing: 2,
            marginLeft: marginLeft ? "2%" : 4,
            marginBottom: noBottom ? 0 : 12,
          },
          style,
        ]}
        color={theme.white_alpha(0.7)}
      >
        {children}
      </MainText>
    </View>
  );
};
export default SeparatorTitle;
