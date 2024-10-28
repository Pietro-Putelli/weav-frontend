import React, { useCallback } from "react";
import { VenueCell } from "../../components/cells";
import { HeaderFlatList } from "../../components/containers";
import { useBusinesses, useLanguages, useUser } from "../../hooks";
import { typographies } from "../../styles";
import { VENUE_CELL_HEIGHT } from "../../styles/sizes";

const BusinessRankingScreen = ({ business, componentId }) => {
  const category = business?.category;
  const businessCity = business?.location?.city ?? "";

  const { businesses, isLoading } = useBusinesses({ category });

  const { languageContent } = useLanguages();

  const renderItem = useCallback(({ item, index }) => {
    return (
      <VenueCell
        isRanking
        venue={item}
        index={index}
        componentId={componentId}
      />
    );
  }, []);

  return (
    <HeaderFlatList
      enabledAnimation
      data={businesses}
      isLoading={isLoading}
      renderItem={renderItem}
      estimatedItemSize={VENUE_CELL_HEIGHT}
      headerProps={{
        title: `${languageContent.top} 10 ${category.title} ${languageContent.in} ${businessCity}`,
        titleStyle: { fontSize: typographies.fontSizes.title7 },
      }}
    />
  );
};

export default BusinessRankingScreen;
