import React, { forwardRef, memo, useRef } from "react";
import { AdvancedFlatList } from "../lists";
import { CELL_HEIGHT } from "./constants";
import mergeRefs from "../../utility/mergeRefs";

const PickerList = forwardRef(({ initialScrollIndex, ...props }, ref) => {
  const scrollRef = useRef();

  return (
    <AdvancedFlatList
      ref={mergeRefs([scrollRef, ref])}
      snapToInterval={CELL_HEIGHT}
      snapToAlignment="start"
      decelerationRate="fast"
      itemSize={CELL_HEIGHT}
      fastSelectionEnabled
      contentContainerStyle={{
        paddingTop: CELL_HEIGHT,
        paddingBottom: CELL_HEIGHT,
      }}
      onLayout={() => {
        if (!isNaN(initialScrollIndex) && initialScrollIndex >= 0) {
          scrollRef.current.scrollToIndex({
            index: initialScrollIndex,
            animated: false,
          });
        }
      }}
      {...props}
    />
  );
});

export default memo(PickerList);
