import React, { memo, useCallback } from "react";
import { ImageTitlePlaceholder } from "../../components/placeholders";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import { showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";

const MomentSpotsPlaceholder = ({ style, onCreatedSpot }) => {
  const { languageContent, locale } = useLanguages();
  const placeholderLanguage = languageContent.placeholders;

  const onCreateSpotPress = useCallback(() => {
    showStackModal({
      screen: SCREENS.CreateSpot,
      passProps: { onCreated: onCreatedSpot },
    });
  }, []);

  return (
    <ImageTitlePlaceholder
      icon={icons.ColoredSpots}
      onPress={onCreateSpotPress}
      style={{ marginTop: "16%", ...style }}
      buttonTitle={languageContent.buttons.spot_someone}
    >
      {locale === "it"
        ? placeholderLanguage.no_spots_yet
        : placeholderLanguage.no_spots_yet_3}
    </ImageTitlePlaceholder>
  );
};

export default memo(MomentSpotsPlaceholder);
