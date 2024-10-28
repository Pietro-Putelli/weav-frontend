import { MotiView } from "moti";
import React, { memo, useMemo, useState } from "react";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { AnimatedBackgroundColorView } from "../animations";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";
import { actionCellContainerStyle, ICON_SIDE } from "./styles";

const EventDetailGoActionCell = ({ isGoing, onPress }) => {
  const [_isGoing, setIsGoing] = useState(isGoing);

  const theme = useTheme();
  const { languageContent } = useLanguages();

  const { title } = useMemo(() => {
    if (_isGoing) {
      return {
        title: languageContent.actions.going,
      };
    }

    return {
      title: languageContent.actions.i_will_go,
    };
  }, [_isGoing]);

  const containerStyle = useMemo(() => {
    return [actionCellContainerStyle];
  }, [_isGoing]);

  return (
    <BounceView
      activeScale={0.95}
      onPress={() => {
        const isGoing = !_isGoing;

        setIsGoing(isGoing);
        onPress(isGoing);
      }}
      style={{ marginRight: 16 }}
    >
      <AnimatedBackgroundColorView
        isActive={_isGoing}
        style={containerStyle}
        colors={[theme.colors.main_accent, theme.colors.aqua]}
      >
        <MotiView
          animate={{ scale: _isGoing ? 0 : 1 }}
          transition={{ type: !_isGoing ? "spring" : "timing" }}
        >
          <SquareImage side={ICON_SIDE} source={icons.Play} />
        </MotiView>
        <MotiView
          style={{ position: "absolute" }}
          animate={{ scale: !_isGoing ? 0 : 1 }}
        >
          <SquareImage side={ICON_SIDE} source={icons.Going} />
        </MotiView>
      </AnimatedBackgroundColorView>

      <MainText
        font="subtitle-5"
        align="center"
        uppercase
        style={{ marginTop: 10 }}
      >
        {title}
      </MainText>
    </BounceView>
  );
};

export default memo(EventDetailGoActionCell);
