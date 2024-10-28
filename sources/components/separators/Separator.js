import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { MainText } from "../texts";

const Separator = ({ title, noMarginTop, style }) => {
  const theme = useTheme();

  return (
    <>
      <View
        style={{
          width: "100%",
          marginVertical: 16,
          alignSelf: "center",
          marginTop: noMarginTop ? 0 : 16,
          height: StyleSheet.hairlineWidth,
          backgroundColor: theme.white_alpha(0.2),
          ...style,
        }}
      />
      {title && (
        <MainText
          uppercase
          bold
          font="subtitle-5"
          style={{
            marginLeft: 8,
            marginBottom: 16,
          }}
        >
          {title}
        </MainText>
      )}
    </>
  );
};
export default memo(Separator);
