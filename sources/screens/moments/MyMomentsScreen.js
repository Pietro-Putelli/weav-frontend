import React, { useCallback, useMemo, useRef } from "react";
import { View } from "react-native";
import { AdvancedFlatList } from "../../components/lists";
import { MomentCell } from "../../components/moments";
import { MyMomentsPlaceholder } from "../../components/placeholders";
import { querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useMyMoment } from "../../hooks";
import { showSheetNavigation, showStackModal } from "../../navigation/actions";
import {
  MediaCellSize,
  NAVIGATION_BAR_HEIGHT,
  TAB_BAR_HEIGHT,
} from "../../styles/sizes";
import { HeaderFlatList } from "../../components/containers";
import { insets } from "../../styles";

const MyMomentsScreen = ({ scrollY, componentId }) => {
  const {
    moments,
    refreshMoments,
    fetchMoments,
    isLoading,
    isRefreshing,
    isNotFound,
    setIsNotFound,
    momentsCount,
  } = useMyMoment();

  const offset = useRef(0);
  const { languageContent } = useLanguages();

  /* Callbacks */

  const onMomentPress = useCallback(
    (moment) => {
      showSheetNavigation({
        screen: SCREENS.MyMomentDetails,
        passProps: { moment, onDeleted },
      });
    },
    [onDeleted]
  );

  const onDeleted = useCallback(() => {
    if (momentsCount <= 1) {
      setIsNotFound(true);
    }
  }, [momentsCount]);

  const onEndReached = useCallback(() => {
    offset.current += querylimits.EIGHT;

    fetchMoments({ offset: offset.current, mode: "append" });
  }, []);

  const onCreateMomentPress = () => {
    showStackModal({
      screen: SCREENS.CreateMoment,
    });
  };

  const headerProps = useMemo(() => {
    return {
      title: languageContent.header_titles.my_moments,
    };
  }, []);

  /* Components */

  const renderItem = useCallback(
    ({ item: moment }) => {
      return (
        <View style={{ marginLeft: 6 }}>
          <MomentCell
            moment={moment}
            onDeleted={onDeleted}
            componentId={componentId}
            onPress={() => onMomentPress(moment)}
          />
        </View>
      );
    },
    [momentsCount, onDeleted]
  );

  const ListEmptyComponent = useMemo(() => {
    if (isNotFound) {
      return <MyMomentsPlaceholder onPress={onCreateMomentPress} />;
    }

    return null;
  }, [isNotFound]);

  return (
    <HeaderFlatList
      removeMargin
      headerProps={headerProps}
      data={moments}
      enabledAnimation
      isLoading={isLoading}
      renderItem={renderItem}
      onRefresh={refreshMoments}
      isRefreshing={isRefreshing}
      onEndReached={onEndReached}
      bulkCount={querylimits.EIGHT}
      ListEmptyComponent={ListEmptyComponent}
      estimatedItemSize={MediaCellSize.minHeight}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 16,
      }}
    />
  );
};

export default MyMomentsScreen;
