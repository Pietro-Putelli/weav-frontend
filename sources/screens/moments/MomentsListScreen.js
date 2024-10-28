import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { HeaderFlatList } from "../../components/containers";
import { MyMomentAsBusinessCell } from "../../components/moments";
import { MainText } from "../../components/texts";
import { actiontypes, querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useMyBusinessMoments } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { MediaCellSize } from "../../styles/sizes";

const TAGGED_EVENT_MOMENTS_LIMIT = querylimits.EIGHT;

const {
  USER_MOMENTS_SCREEN: { TAGS },
} = actiontypes;

const UserMomentsListScreen = ({ type, componentId }) => {
  /* States */

  const { moments, fetchMoments, isLoading, isRefreshing, isEvent } =
    useMyBusinessMoments({ type });

  const { languageContent } = useLanguages();

  const offset = useRef(0);

  /* Callbacks */

  const onRefresh = useCallback(() => {
    offset.current = 0;
    fetchMoments();
  }, []);

  const onEndReached = useCallback(() => {
    offset.current += TAGGED_EVENT_MOMENTS_LIMIT;

    fetchMoments(offset.current);
  }, []);

  const onRemoveTagPress = () => {};

  const onMomentPress = useCallback(() => {
    showSheetNavigation({
      screen: SCREENS.MenuModal,
      passProps: {
        type: actiontypes.MENU_MODAL.USER_TAGGED_EVENT_MOMENT,
        onRemoveTagPress,
      },
    });
  }, []);

  /* Props */

  const { title, headerTitle } = useMemo(() => {
    let title, headerTitle;

    switch (type) {
      case TAGS:
        title = languageContent.who_mentioned_you;
        headerTitle = languageContent.who_mentioned_you_business_content;
        break;
    }

    return { title, headerTitle };
  }, []);

  /* Components */

  const renderItem = useCallback(({ item }) => {
    return (
      <MyMomentAsBusinessCell
        moment={item}
        onPress={onMomentPress}
        componentId={componentId}
        isEvent={isEvent}
      />
    );
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.tag_header}>
        <MainText align="center" font="subtitle-2">
          {headerTitle}
        </MainText>
      </View>
    );
  }, []);

  return (
    <HeaderFlatList
      data={moments}
      removeMargin
      enabledAnimation
      isLoading={isLoading}
      renderItem={renderItem}
      onRefresh={onRefresh}
      headerProps={{ title }}
      isRefreshing={isRefreshing}
      renderHeader={renderHeader}
      onEndReached={onEndReached}
      bulkCount={TAGGED_EVENT_MOMENTS_LIMIT}
      estimatedItemSize={MediaCellSize.minHeight}
    />
  );
};

export default UserMomentsListScreen;

const styles = StyleSheet.create({
  tag_header: {
    marginHorizontal: "4%",
    marginBottom: "6%",
  },
});
