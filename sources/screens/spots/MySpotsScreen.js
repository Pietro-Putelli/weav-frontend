import React, { useCallback, useMemo, useRef } from "react";
import { AdvancedFlatList } from "../../components/lists";
import { MomentSpotsPlaceholder } from "../../components/placeholders";
import { SpotCell } from "../../components/spots";
import { querylimits } from "../../constants";
import { useSpots } from "../../hooks";
import { SPOTS_MODE } from "../../hooks/useSpots";
import { NAVIGATION_BAR_HEIGHT, TAB_BAR_HEIGHT } from "../../styles/sizes";

const MySpotsScreen = ({ scrollY, componentId }) => {
  const { spots, isLoading, isNotFound, fetchSpots } = useSpots({
    mode: SPOTS_MODE.MINE,
  });

  const offset = useRef(0);

  /* Callbacks */

  const onEndReached = useCallback(() => {
    offset.current += querylimits.EIGHT;

    fetchSpots(offset.current);
  }, []);

  /* Components */

  const renderItem = useCallback(({ item }) => {
    return <SpotCell isMine spot={item} componentId={componentId} />;
  }, []);

  const ListEmptyComponent = useMemo(() => {
    if (isNotFound) {
      return (
        <MomentSpotsPlaceholder style={{ marginTop: "45%", height: 300 }} />
      );
    }

    return null;
  }, [isNotFound]);

  return (
    <AdvancedFlatList
      data={spots}
      enabledAnimation
      scrollY={scrollY}
      isLoading={isLoading}
      renderItem={renderItem}
      estimatedItemSize={100}
      onEndReached={onEndReached}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={{
        paddingBottom: TAB_BAR_HEIGHT + 16,
        paddingTop: NAVIGATION_BAR_HEIGHT + 8,
      }}
    />
  );
};

export default MySpotsScreen;
