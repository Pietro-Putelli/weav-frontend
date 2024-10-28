import React, { useCallback, useMemo } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { FadeAnimatedView } from "../../components/animations";
import { HorizontalUserProfileCell } from "../../components/cells";
import { MainScrollView } from "../../components/containers";
import { SolidSearchBar } from "../../components/inputs";
import { AdvancedFlatList } from "../../components/lists";
import { MainText } from "../../components/texts";
import querylimits from "../../constants/querylimits";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useSearchUsers } from "../../hooks";
import { pushNavigation, showSheetNavigation } from "../../navigation/actions";
import { icons, insets } from "../../styles";

const UserSearchScreen = ({ componentId }) => {
  const {
    users,
    fetchUsers,
    isNotFound,
    isLoadingMore,
    onEndReached,
    ...searchProps
  } = useSearchUsers({ limit: querylimits.SIXTEEN });

  const { languageContent } = useLanguages();

  /* Callbacks */

  const onUserPress = useCallback((user) => {
    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user },
    });
  }, []);

  const onShareAppPress = () => {
    Keyboard.dismiss();

    showSheetNavigation({
      screen: SCREENS.InviteFriends,
    });
  };

  /* Components */

  const renderItem = useCallback(({ item }) => {
    return <HorizontalUserProfileCell onPress={onUserPress} user={item} />;
  }, []);

  const ListEmptyComponent = useMemo(() => {
    if (isNotFound) {
      return (
        <FadeAnimatedView style={{ marginTop: "4%", marginHorizontal: "4%" }}>
          <MainText align="center" font="subtitle">
            {languageContent.placeholders.no_users_search}
          </MainText>
        </FadeAnimatedView>
      );
    }
    return null;
  }, [isNotFound]);

  return (
    <MainScrollView
      onRightPress={onShareAppPress}
      rightIcon={icons.ShareOutside}
      title={languageContent.header_titles.search_for_users}
      scrollEnabled={false}
    >
      <FadeAnimatedView mode="fade-up" style={styles.searchContainer}>
        <SolidSearchBar
          autoFocus
          placeholder={languageContent.text_placeholders.type_username}
          {...searchProps}
        />
      </FadeAnimatedView>

      <AdvancedFlatList
        data={users}
        extraData={users}
        enabledAnimation
        renderItem={renderItem}
        onEndReached={onEndReached}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        ListEmptyComponent={ListEmptyComponent}
        isLoading={isLoadingMore}
        bulkCount={querylimits.SIXTEEN}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      />
    </MainScrollView>
  );
};

export default UserSearchScreen;

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: "4%",
  },
});
