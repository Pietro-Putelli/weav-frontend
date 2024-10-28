import { isNull } from "lodash";
import React, { useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Navigation } from "react-native-navigation";
import { RecentPicksView } from "../../components/addmoment";
import { FadeAnimatedView } from "../../components/animations";
import { ToastAlertView } from "../../components/badgeviews";
import { SolidButton } from "../../components/buttons";
import { MainScrollView } from "../../components/containers";
import { EditPostPreview } from "../../components/posts";
import { imagesizes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useUserPosts } from "../../hooks";
import { UserPostMethods } from "../../hooks/useUserPosts";
import { showModalNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { openPicker } from "../../utility/imagepicker";

const { height } = Dimensions.get("window");
const EXTRA_SCROLL_HEIGHT = height * 0.06;

const EditUserPostScreen = ({ initialPost, componentId }) => {
  /* Utility */
  const { languageContent } = useLanguages();

  /* States */

  const {
    post,
    isEditing,
    isLoading,
    isInvalidSource,
    createOrUpdatePost,
    updatePostState,
    deletePost,
  } = useUserPosts({
    method: UserPostMethods.CREATE,
    initialPost,
  });

  /* props */

  const { isInterfaceVisible, isBottomContentVisible } = useMemo(() => {
    const hasSource = !isNull(post.source);

    const isBottomContentVisible = hasSource || isEditing;

    return {
      hasSource,
      isBottomContentVisible,
      isInterfaceVisible: hasSource || isEditing,
    };
  }, [post]);

  const headerProps = useMemo(() => {
    return {
      modal: true,
      title: languageContent.buttons.create_post,
      scrollEnabled: false,
    };
  }, []);

  /* Callbacks */

  const onTileChangeText = useCallback(({ value }) => {
    updatePostState({ title: value });
  }, []);

  const onContentChangeText = useCallback(({ value }) => {
    updatePostState({ content: value });
  }, []);

  const onAssetSelected = useCallback((source) => {
    updatePostState({ source });
  }, []);

  const onCameraPress = useCallback(() => {
    showModalNavigation({
      screen: SCREENS.Camera,
      fullscreen: true,
      passProps: {
        isModal: true,
        isActive: true,
        isLibraryDisabled: true,
        onMediaCaptured: onAssetSelected,
      },
    });
  }, []);

  const onLibraryPress = useCallback(() => {
    openPicker(imagesizes.POST_CROP, onAssetSelected);
  }, []);

  const dismissModal = () => {
    setTimeout(() => {
      Navigation.dismissAllModals();
    }, 100);
  };

  const onCreateOrUpdatePress = () => {
    createOrUpdatePost(dismissModal);
  };

  const onDeletePress = () => {
    deletePost(dismissModal);
  };

  /* Components */

  const renderBottomContent = useCallback(() => {
    if (isEditing) {
      return (
        <View style={{ flexDirection: "row" }}>
          <SolidButton
            marginRight
            flex
            type="done"
            loading={isLoading}
            onPress={onCreateOrUpdatePress}
            title={languageContent.buttons.update_post}
          />
          <SolidButton
            flex
            type="delete"
            title="delete"
            icon={icons.Bin}
            onPress={onDeletePress}
          />
        </View>
      );
    }

    return (
      <SolidButton
        flex
        type="done"
        loading={isLoading}
        onPress={onCreateOrUpdatePress}
        title={languageContent.buttons.create_post}
      />
    );
  }, [isLoading, createOrUpdatePost]);

  return (
    <>
      <MainScrollView
        {...headerProps}
        contentStyle={styles.scrollContent}
        renderBottomContent={renderBottomContent}
        isBottomContentVisible={isBottomContentVisible}
      >
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          extraScrollHeight={EXTRA_SCROLL_HEIGHT}
        >
          {!isInterfaceVisible && (
            <RecentPicksView
              componentId={componentId}
              onAssetSelected={onAssetSelected}
              style={styles.recentPicksContainer}
              resizeOptions={imagesizes.POST_CROP}
            />
          )}

          {isInterfaceVisible && (
            <View style={styles.content}>
              <EditPostPreview
                post={post}
                onTileChangeText={onTileChangeText}
                onContentChangeText={onContentChangeText}
              />

              <FadeAnimatedView delay={400} style={styles.buttons}>
                <SolidButton
                  flex
                  marginRight
                  icon={icons.Camera}
                  onPress={onCameraPress}
                  title={languageContent.camera}
                />
                <SolidButton
                  flex
                  icon={icons.Library}
                  onPress={onLibraryPress}
                  title={languageContent.library}
                />
              </FadeAnimatedView>
            </View>
          )}
        </KeyboardAwareScrollView>
      </MainScrollView>

      <ToastAlertView hideIcon visible={isInvalidSource} isTop>
        {languageContent.nice_try}
      </ToastAlertView>
    </>
  );
};

export default EditUserPostScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 0,
  },
  recentPicksContainer: { marginTop: "25%" },
  content: {
    alignItems: "center",
  },
  buttons: {
    marginTop: "4%",
    flexDirection: "row",
    marginHorizontal: 12,
  },
});
