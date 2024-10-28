import React, { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { FadeAnimatedView } from "../../components/animations";
import { IconButton } from "../../components/buttons";
import { MainScrollView } from "../../components/containers";
import { BusinessEmptyPostsPlaceholder } from "../../components/placeholders";
import { PostsList } from "../../components/posts";
import { MainText } from "../../components/texts";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import {
  useBusinessPosts,
  useCurrentBusiness,
  useLanguages,
  useTheme,
} from "../../hooks";
import {
  showModalNavigation,
  showSheetNavigation,
  showStackModal,
} from "../../navigation/actions";
import { icons } from "../../styles";

const BusinessPostsListScreen = () => {
  const { business } = useCurrentBusiness();

  const { posts, postsCount, isNotFound, setIsNotFound } = useBusinessPosts();

  const maxPostReached = postsCount == 4;

  const theme = useTheme();
  const { languageContent } = useLanguages();

  /* CALLBACKS */

  const onNewPress = useCallback(() => {
    showStackModal({ screen: SCREENS.EditBusinessPost });
  }, []);

  const onPostPress = useCallback(
    (_, index) => {
      showModalNavigation({
        screen: SCREENS.BusinessPosts,
        fullscreen: true,
        passProps: { initialIndex: index },
      });
    },
    [business]
  );

  const onPostLongPress = useCallback(
    (post) => {
      showSheetNavigation({
        screen: SCREENS.MenuModal,
        passProps: {
          type: actiontypes.MENU_MODAL.EDIT_POST,
          props: {
            post,
            onDeleted: () => {
              if (postsCount == 1) {
                setIsNotFound(true);
              }
            },
          },
        },
      });
    },
    [postsCount]
  );

  const headerProps = useMemo(() => {
    return {
      title: "Posts",
      noBack: true,
      rightComponent: () => {
        return (
          <IconButton
            inset={2}
            source={icons.Add}
            onPress={onNewPress}
            disabled={maxPostReached}
          />
        );
      },
    };
  }, [maxPostReached]);

  const renderPlaceholder = useCallback(() => {
    return <BusinessEmptyPostsPlaceholder />;
  }, []);

  return (
    <MainScrollView {...headerProps}>
      {maxPostReached && (
        <FadeAnimatedView
          style={[styles.headerContainer, theme.styles.shadow_round]}
        >
          <MainText font="subtitle-1">
            {languageContent.you_can_create_max_4}
          </MainText>
        </FadeAnimatedView>
      )}
      <PostsList
        posts={posts}
        onPress={onPostPress}
        isNotFound={isNotFound}
        onLongPress={onPostLongPress}
        renderPlaceholder={renderPlaceholder}
      />
    </MainScrollView>
  );
};

export default BusinessPostsListScreen;

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: "4%",
    alignItems: "center",
    padding: "4%",
  },
});
