import React, { memo, useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { actiontypes } from "../../constants";
import querylimits from "../../constants/querylimits";
import { SCREENS } from "../../constants/screens";
import { useFeeds, useLanguages } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { readFeeds } from "../../store/slices/feedsReducer";
import {
  MediaCellSize,
  NAVIGATION_BAR_HEIGHT,
  TAB_BAR_HEIGHT,
} from "../../styles/sizes";
import { AdvancedFlatList } from "../lists";
import { MomentCell } from "../moments";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";

const MomentsFeed = ({ scrollY, componentId }) => {
  const { feeds, isLoading, isRefreshing, isNotFound, fetchFeeds } = useFeeds({
    type: "moments",
  });

  const { languageContent } = useLanguages();
  const dispatch = useDispatch();

  /* Effects */

  useEffect(() => {
    dispatch(readFeeds());
  }, []);

  const onRefresh = useCallback(() => {
    fetchFeeds();
  }, []);

  const onEndReached = useCallback(() => {
    offset.current += querylimits.EIGHT;

    fetchFeeds(offset.current);
  }, []);

  const onMenuPress = useCallback((moment) => {
    showSheetNavigation({
      screen: SCREENS.MenuModal,
      passProps: {
        momentId: moment.id,
        type: actiontypes.MENU_MODAL.USER_TAGGED_IN_MOMENT,
      },
    });
  }, []);

  /* Components */

  const renderItem = useCallback(({ item, index }) => {
    return (
      <View style={{ marginLeft: 6 }}>
        <MomentCell
          isMyFeed
          moment={item}
          index={index}
          componentId={componentId}
          onMenuPress={() => {
            onMenuPress(item);
          }}
        />
      </View>
    );
  }, []);

  const ListHeaderComponent = useMemo(() => {
    return (
      <SeparatorTitle marginLeft>
        {languageContent.separator_titles.moments_tagged}
      </SeparatorTitle>
    );
  }, []);

  const ListEmptyComponent = useMemo(() => {
    if (isNotFound) {
      return (
        <View style={{ alignItems: "center", marginTop: "4%" }}>
          <MainText font="subtitle">
            {languageContent.placeholders.no_moments_yet}
          </MainText>
        </View>
      );
    }
  }, [isNotFound]);

  return (
    <AdvancedFlatList
      data={feeds}
      enabledAnimation
      scrollY={scrollY}
      onRefresh={onRefresh}
      isLoading={isLoading}
      renderItem={renderItem}
      onEndReached={onEndReached}
      isRefreshing={isRefreshing}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      estimatedItemSize={MediaCellSize.minHeight}
      contentContainerStyle={{
        paddingTop: NAVIGATION_BAR_HEIGHT,
        paddingBottom: TAB_BAR_HEIGHT,
      }}
    />
  );
};

export default memo(MomentsFeed);
