import React, { forwardRef } from "react";
import { ScrollView } from "react-native-gesture-handler";

const PaginatedScrollView = forwardRef(
  ({ itemSize, children, onChange, ...props }, ref) => {
    const onMomentumScrollEnd = ({
      nativeEvent: {
        contentOffset: { x },
      },
    }) => {
      const index = Math.max(0, Math.floor(x / itemSize));
      onChange(index);
    };

    return (
      <ScrollView
        ref={ref}
        onMomentumScrollEnd={onMomentumScrollEnd}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
);

export default PaginatedScrollView;
