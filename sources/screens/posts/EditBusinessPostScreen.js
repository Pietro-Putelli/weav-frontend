import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Keyboard, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Navigation } from "react-native-navigation";
import { isInFileSystem } from "../../backend/formatters/utility";
import { RecentPicksView } from "../../components/addmoment";
import { FadeAnimatedView } from "../../components/animations";
import { ToastAlertView } from "../../components/badgeviews";
import { IconButton, SolidButton } from "../../components/buttons";
import { MainScrollView } from "../../components/containers";
import { EdgeGesture } from "../../components/gestures";
import { HorizontalCarousel } from "../../components/lists";
import { EditPostPreview } from "../../components/posts";
import { imagesizes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useCreateBusinessPost, useLanguages } from "../../hooks";
import { DoubleOptionPopupModal } from "../../modals";
import { pushNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { CELL_POST_WIDTH } from "../../styles/sizes";
import { isAndroidDevice } from "../../utility/functions";
import { openPicker } from "../../utility/imagepicker";

const isAndroid = isAndroidDevice();

const { height } = Dimensions.get("window");
const EXTRA_SCROLL_HEIGHT = height * 0.06;

const POST_PREVIEW_WIDTH = CELL_POST_WIDTH * 2;

const EditBusinessPostScreen = ({ initialPost, onEndEditing, componentId }) => {
  /* States */

  const [visiblePopup, setVisiblePopUp] = useState(false);
  const [popupOptions, setPopupOptions] = useState({
    visible: false,
    title: "",
  });

  const { languageContent } = useLanguages();

  const {
    post,
    slices,
    slicesCount,
    hasSlices,
    isEditing,
    isLoading,
    selectedSlice,
    hasPostChanged,
    tooManySlices,
    areAllSlicesInvalid,
    isCreateButtonDisabled,

    updatePostState,
    updatePostSliceState,
    createOrUpdatePost,
    deletePost,
    deletePostSlice,

    onSliceChanged,
    onAssetSelected,
  } = useCreateBusinessPost({ initialPost });

  const carouselRef = useRef();

  /* Callbacks */

  const onRemovePress = useCallback(
    (slice) => {
      if (isInFileSystem(slice.source.uri)) {
        updatePostSliceState({ slice, mode: "delete" });
      } else {
        setPopupOptions({
          visible: true,
          title: languageContent.popup_contents.delete_slice,
          type: "slice",
        });
      }
    },
    [updatePostSliceState]
  );

  const onSlicesSorted = useCallback((slices) => {
    updatePostState({ slices });

    scrollCarouselToIndex(0);
  }, []);

  const onCreateOrUpdatePress = useCallback(() => {
    Keyboard.dismiss();

    if (isLoading) {
      return;
    }

    createOrUpdatePost((successful) => {
      if (successful) {
        dismiss();

        onEndEditing?.();
      }
    });
  }, [createOrUpdatePost, isLoading]);

  const onDeletePress = useCallback(() => {
    setPopupOptions({
      visible: true,
      title: languageContent.popup_contents.delete_post,
      type: "post",
    });
  }, []);

  const onDeleteDonePress = useCallback(() => {
    const type = popupOptions?.type;

    const sliceId = selectedSlice?.id;
    const postId = post?.id;

    const callback = (successful) => {
      if (successful) {
        if (type == "post" || (type == "slice" && slicesCount == 1)) {
          dismiss();
        }
      }
    };

    if (sliceId) {
      deletePostSlice({ sliceId, postId }, callback);
    } else {
      deletePost(postId, callback);
    }
  }, [popupOptions, selectedSlice, slicesCount]);

  const onBack = useCallback(() => {
    if (hasPostChanged) {
      setVisiblePopUp(true);
    } else {
      dismiss();
    }
  }, [hasPostChanged]);

  /* Methods */

  const dismiss = () => {
    Navigation.dismissAllModals();
  };

  const scrollCarouselToIndex = (index) => {
    setTimeout(() => {
      carouselRef.current?.scrollToIndex({ index, animate: true });
    }, 100);
  };

  const onSourcePress = useCallback(() => {
    openPicker(imagesizes.POST_CROP, (asset) => {
      onAssetSelected(asset);

      scrollCarouselToIndex(slicesCount);
    });
  }, [slicesCount, onAssetSelected]);

  const onTileChangeText = ({ value, index }) => {
    updatePostSliceState({ slice: { title: value }, index });
  };

  const onContentChangeText = ({ value, index }) => {
    updatePostSliceState({ slice: { content: value }, index });
  };

  const onSortingPress = useCallback(() => {
    pushNavigation({
      screen: SCREENS.SortSlices,
      componentId,
      passProps: { slices, onSlicesSorted },
    });
  }, [slices]);

  /* Componenets */

  const renderBottomContent = useCallback(() => {
    if (isEditing) {
      return (
        <View style={{ flexDirection: "row" }}>
          <SolidButton
            marginRight
            flex
            type="done"
            title={languageContent.buttons.update_post}
            loading={isLoading}
            disabled={isCreateButtonDisabled}
            onPress={onCreateOrUpdatePress}
          />
          <SolidButton
            onPress={onDeletePress}
            icon={icons.Bin}
            flex
            title="delete"
            type="delete"
          />
        </View>
      );
    }

    return (
      <SolidButton
        flex
        type="done"
        loading={isLoading}
        title={languageContent.buttons.create_post}
        disabled={isCreateButtonDisabled}
        onPress={onCreateOrUpdatePress}
      />
    );
  }, [
    isEditing,
    isLoading,
    isCreateButtonDisabled,
    post,
    onCreateOrUpdatePress,
  ]);

  const rightButton = () => {
    return <IconButton onPress={onBack} inset={3} source={icons.Cross} />;
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <EditPostPreview
          post={item}
          index={index}
          onRemovePress={onRemovePress}
          onTileChangeText={onTileChangeText}
          onContentChangeText={onContentChangeText}
        />
      );
    },
    [post, slices]
  );

  const rightComponent = useCallback(() => {
    if (slicesCount === 0) {
      return null;
    }

    return (
      <FadeAnimatedView mode="fade-left" style={{ flexDirection: "row" }}>
        <IconButton onPress={onSourcePress} source={icons.Add} inset={1} />

        {slicesCount > 1 && (
          <FadeAnimatedView mode="fade-left">
            <IconButton
              inset={1}
              source={icons.Sorting}
              onPress={onSortingPress}
              style={{ marginLeft: 12 }}
            />
          </FadeAnimatedView>
        )}
      </FadeAnimatedView>
    );
  }, [slicesCount, onSourcePress]);

  /* Props */

  const headerProps = useMemo(() => {
    return {
      modal: true,
      title: isEditing
        ? languageContent.header_titles.edit_post
        : languageContent.buttons.create_post,
      rightComponent,
    };
  }, [rightButton, rightComponent, isEditing]);

  return (
    <>
      <EdgeGesture
        setVisible={setVisiblePopUp}
        visible={visiblePopup}
        onBack={onBack}
      >
        <MainScrollView
          {...headerProps}
          scrollEnabled={isAndroid}
          isBottomContentVisible={hasSlices}
          contentStyle={{ paddingHorizontal: 0 }}
          renderBottomContent={renderBottomContent}
        >
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            extraScrollHeight={EXTRA_SCROLL_HEIGHT}
          >
            {hasSlices ? (
              <HorizontalCarousel
                noPadding
                data={slices}
                ref={carouselRef}
                renderItem={renderItem}
                itemWidth={POST_PREVIEW_WIDTH}
                onSnapToItem={({ index }) => onSliceChanged(index)}
                contentContainerStyle={styles.contentContainerStyle}
              />
            ) : (
              <RecentPicksView
                componentId={componentId}
                style={{ marginTop: "25%" }}
                onAssetSelected={onAssetSelected}
                resizeOptions={imagesizes.POST_CROP}
              />
            )}
          </KeyboardAwareScrollView>
        </MainScrollView>
      </EdgeGesture>

      <ToastAlertView hideIcon visible={areAllSlicesInvalid} isTop>
        {languageContent.nice_try}
      </ToastAlertView>

      <ToastAlertView visible={tooManySlices} isTop>
        {languageContent.max_slices}
      </ToastAlertView>

      <DoubleOptionPopupModal
        title={popupOptions.title}
        setVisible={(visible) => {
          setPopupOptions({ ...popupOptions, visible });
        }}
        visible={popupOptions.visible}
        onDonePress={onDeleteDonePress}
      />
    </>
  );
};

export default EditBusinessPostScreen;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: "4%",
  },
  contentContainerStyle: {
    paddingHorizontal: 12,
    paddingTop: "8%",
    paddingBottom: 100,
  },
});
