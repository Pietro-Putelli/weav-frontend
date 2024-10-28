import React, { useEffect, useMemo } from "react";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import ScaleAnimatedView from "./ScaleAnimatedView";
import { triggerHaptic } from "../../utility/haptics";

const AnimatedFeedbackView = ({ isVisible, isPositive, style }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  useEffect(() => {
    if (isVisible) {
      triggerHaptic();
    }
  }, [isVisible]);

  const containerStyle = useMemo(() => {
    return {
      alignItems: "center",
      flexDirection: "row",
      ...theme.styles.shadow_round,
      padding: 16,
      paddingHorizontal: 24,
      ...style,
    };
  }, [style]);

  const { icon, title, color } = useMemo(() => {
    const icon = isPositive ? icons.CircleCheck : icons.CircleCross;
    const title = isPositive
      ? languageContent.valid_code
      : languageContent.invalid_code;
    const color = isPositive ? theme.colors.main_accent : theme.colors.red;

    return {
      icon,
      title,
      color,
    };
  }, [isPositive]);

  if (!isVisible) {
    return null;
  }

  return (
    <ScaleAnimatedView style={containerStyle}>
      <SquareImage side={28} source={icon} color={color} />
      <MainText bold style={{ marginLeft: 12 }} font="title-8">
        {title}
      </MainText>
    </ScaleAnimatedView>
  );
};

export default AnimatedFeedbackView;
