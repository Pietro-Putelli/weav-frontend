import { MotiView } from "moti";
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useLanguages, useTheme } from "../../hooks";
import { MainText } from "../texts";

const TRANSLATE_Y = RFPercentage(8);

const InvalidSourceView = ({ visible }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  return (
    <MotiView
      from={{ translateY: 0 }}
      animate={{ translateY: visible ? -TRANSLATE_Y : 0 }}
      style={[styles.container, theme.styles.shadow_round]}
    >
      <MainText numberOfLines={1} font="subtitle-1">
        {languageContent.nice_try}
      </MainText>
    </MotiView>
  );
};

export default memo(InvalidSourceView);

const styles = StyleSheet.create({
  container: {
    padding: "3%",
    paddingHorizontal: "4%",
    marginTop: "2%",
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    alignSelf: "center",
  },
});
