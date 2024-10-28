import React, { memo } from "react";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const ICON_SIDE = widthPercentage(0.25);

const VenuesPlaceholder = ({ hasFilters, onPress }) => {
  const { languageContent } = useLanguages();

  return (
    <FadeAnimatedView
      style={{
        marginTop: "44%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SquareImage
        coloredIcon
        side={ICON_SIDE}
        source={icons.ColoredCocktail}
      />
      <MainText
        style={{ marginTop: "4%", paddingHorizontal: "12%" }}
        align="center"
        font="subtitle"
      >
        {languageContent.placeholders.no_venues}
      </MainText>

      <SolidButton
        title={
          languageContent.buttons[hasFilters ? "clear_filter" : "show_closed"]
        }
        type="done"
        onPress={onPress}
        style={{ marginTop: "6%" }}
      />
    </FadeAnimatedView>
  );
};

export default memo(VenuesPlaceholder);
