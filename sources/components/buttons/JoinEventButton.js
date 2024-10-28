import React from "react";
import DoubleStateButton from "./DoubleStateButton";
import { icons } from "../../styles";
import { useLanguages, useTheme } from "../../hooks";

const JoinEventButton = ({ isActive, onPress, style }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  return (
    <DoubleStateButton
      type="done"
      isActive={isActive}
      onPress={onPress}
      style={style}
      titles={[
        languageContent.buttons.join_the_event,
        languageContent.actions.i_will_go,
      ]}
      colors={[theme.colors.main_accent, theme.colors.aqua]}
      icons={[null, icons.Going]}
    />
  );
};

export default JoinEventButton;
