import React, { forwardRef, memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { insets } from "../../styles";
import { TAB_BAR_HEIGHT } from "../../styles/sizes";
import { HeaderAlphaTitle } from "../headers";
import { VenueHeader } from "../headers/";
import { AdvancedFlatList } from "../lists";
import { VenueBottomView } from "../venue";

const StretchableHeaderView = forwardRef(
  (
    {
      data,
      event,
      business,
      children,
      isLoadingPosts,
      isLoading,
      onMorePress,
      isPreview,
      renderItem,
      onContactPress,
      onSpotsPress,
      showReserve,
      showSpots,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const scrollY = useSharedValue(0);

    const isBottomVisible = !(!showReserve && !showSpots) && !isPreview;

    const backgroundColor = theme.colors.background;

    const posts = useMemo(() => {
      return isLoading ? [] : data;
    }, [isLoading, data]);

    /* Components */

    const ListHeaderComponent = useMemo(() => {
      return (
        <VenueHeader
          event={event}
          scrollY={scrollY}
          business={business}
          children={children}
        />
      );
    }, [business, children]);

    return (
      <View style={[styles.container, { backgroundColor }]}>
        <HeaderAlphaTitle
          scrollY={scrollY}
          isPreview={isPreview}
          title={business?.name}
          onMorePress={onMorePress}
        />

        <AdvancedFlatList
          bulkCount={4}
          data={posts}
          isLoading={isLoadingPosts}
          scrollEventThrottle={1}
          scrollY={scrollY}
          ref={ref}
          numColumns={2}
          enabledAnimation
          contentContainerStyle={{
            paddingBottom: isBottomVisible
              ? TAB_BAR_HEIGHT + 24
              : insets.bottomAndroid + 16,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 8,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ListHeaderComponent={ListHeaderComponent}
          {...props}
        />

        {!isPreview && (
          <VenueBottomView
            business={business}
            showSpots={showSpots}
            showReserve={showReserve}
            onSpotsPress={onSpotsPress}
            onReservePress={onContactPress}
          />
        )}
      </View>
    );
  }
);

export default memo(StretchableHeaderView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
  loading_container: {
    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.absoluteFill,
  },
});
