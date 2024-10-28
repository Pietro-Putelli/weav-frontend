import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useSharedValue } from "react-native-reanimated";
import { IconButton } from "../../components/buttons";
import { DismissPostGesture } from "../../components/gestures";
import { BluredImageBackground } from "../../components/images";
import { AdvancedFlatList } from "../../components/lists";
import { SlicesContainer } from "../../components/posts";
import { LinearGradient } from "../../components/views";
import { useBusinessPosts } from "../../hooks";
import { gradients, icons, insets } from "../../styles";
import { isAndroidDevice } from "../../utility/functions";

const isAndroid = isAndroidDevice();

const { width, height } = Dimensions.get("window");

const BusinessPostsScreen = ({
  businessId,
  initialIndex = 0,
  onChangeIndex,
}) => {
  /* States */

  const { posts, isCaching, fetchPosts } = useBusinessPosts({ businessId });

  const postsCount = posts?.length ?? 0;

  const [currentPostIndex, setCurrentPostIndex] = useState(initialIndex);
  const [isScrolling, setIsScrolling] = useState(false);

  /* Utility Hooks */

  const postOffset = useRef(0);
  const scrollX = useSharedValue(0);
  const navigation = useNavigation();

  /* Effects */

  useEffect(() => {
    onChangeIndex?.(currentPostIndex);
  }, [currentPostIndex]);

  /* Methods */

  const onClosePress = () => {
    navigation.dismissModal();
  };

  const onMomentumScrollEnd = useCallback(({ x }) => {
    const index = Math.max(0, Math.floor(x / width));

    setCurrentPostIndex(index);
    setIsScrolling(false);
  }, []);

  const onEndReached = useCallback(() => {
    if (isCaching) {
      return;
    }

    postOffset.current += 4;

    fetchPosts(postOffset.current);
  }, [isCaching]);

  /* Components */

  const renderItem = useCallback(({ item: post, index }) => {
    return <SlicesContainer post={post} index={index} scrollX={scrollX} />;
  }, []);

  if (postsCount == 0) {
    return null;
  }

  return (
    <DismissPostGesture disabled={isAndroid}>
      <View style={{ width, height }}>
        <BluredImageBackground scrollX={scrollX} sources={posts} />

        <LinearGradient
          colors={gradients.Shadow1}
          style={[styles.gradient, styles.topGradient]}
        >
          <IconButton
            blur
            inset={2}
            source={icons.Cross}
            onPress={onClosePress}
          />
        </LinearGradient>

        <View style={{ marginTop: 12 }}>
          <AdvancedFlatList
            horizontal
            data={posts}
            pagingEnabled
            itemSize={width}
            scrollX={scrollX}
            renderItem={renderItem}
            estimatedItemSize={width}
            extraData={currentPostIndex}
            scrollEnabled={!isScrolling}
            initialScrollIndex={initialIndex}
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
        </View>

        <LinearGradient
          inverted
          colors={gradients.Shadow1}
          style={[styles.gradient, { height: "10%", bottom: 0 }]}
        />
      </View>
    </DismissPostGesture>
  );
};

export default BusinessPostsScreen;

const styles = StyleSheet.create({
  gradient: {
    width,
    position: "absolute",
    paddingBottom: 12,
    left: 0,
    zIndex: 10,
  },
  topGradient: {
    top: 0,
    alignItems: "flex-end",
    paddingTop: insets.top,
    paddingRight: 4,
  },
});
