import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BusinessAPI from "../../backend/business";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { VENUE_CELL_HEIGHT } from "../../styles/sizes";
import { VenueCell } from "../cells";
import { HeaderFlatList } from "../containers";
import { ImageTitlePlaceholder } from "../placeholders";

const LikedVenues = ({ title, componentId }) => {
  const [venues, setVenues] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const offset = useRef(0);
  const { languageContent } = useLanguages();

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = () => {
    BusinessAPI.getLiked({ offset: offset.current }, (data) => {
      if (data) {
        setIsLoading(false);
        setVenues(data);
      }

      setIsNotFound(isEmpty(data));
    });
  };

  const renderItem = useCallback(
    ({ item: venue }) => {
      return (
        <VenueCell
          venue={venue}
          componentId={componentId}
          style={{ height: VENUE_CELL_HEIGHT / 2 }}
        />
      );
    },
    [venues]
  );

  const renderEmptyComponent = useCallback(() => {
    if (isNotFound) {
      return (
        <ImageTitlePlaceholder icon={icons.ColoredBar}>
          {languageContent.placeholders.favorite_businesses}
        </ImageTitlePlaceholder>
      );
    }

    return null;
  }, [isNotFound]);

  return (
    <HeaderFlatList
      data={venues}
      enabledAnimation
      isLoading={isLoading}
      renderItem={renderItem}
      headerProps={{ title }}
      renderEmptyComponent={renderEmptyComponent}
    />
  );
};

export default LikedVenues;
