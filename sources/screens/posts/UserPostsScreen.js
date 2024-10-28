import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks";
import Animated, { SlideInDown } from "react-native-reanimated";
import {
  AnimatedModalBackgroundView,
  FadeAnimatedView,
} from "../../components/animations";
import { IconButton } from "../../components/buttons";
import { HorizontalCarousel } from "../../components/lists";
import { UserPostFullCell } from "../../components/posts";
import { MainText } from "../../components/texts";
import { useLanguages, useUser, useUserPosts } from "../../hooks";
import { icons, insets } from "../../styles";
import { CELL_POST_HEIGHT, CELL_POST_WIDTH } from "../../styles/sizes";

const UserPostsScreen = ({ userId, initialIndex, userName }) => {
  const { posts } = useUserPosts({ userId });

  const { amI } = useUser({ userId });

  const navigation = useNavigation();
  const { languageContent, locale } = useLanguages();

  const renderItem = useCallback(({ item }) => {
    return <UserPostFullCell post={item} />;
  }, []);

  const title = useMemo(() => {
    if (amI) {
      return languageContent.my_posts;
    }

    if (locale == "en") {
      return userName + "'s posts";
    }

    return "I post di " + userName;
  }, []);

  return (
    <AnimatedModalBackgroundView>
      <View style={styles.container}>
        <FadeAnimatedView mode="fade-up" style={styles.topHeader}>
          <MainText
            font="title-7"
            numberOfLines={1}
            style={styles.topHeaderTitle}
          >
            {title}
          </MainText>

          <IconButton
            inset={2}
            style={styles.closeButton}
            source={icons.Cross}
            onPress={() => {
              navigation.dismissModal();
            }}
          />
        </FadeAnimatedView>

        <View style={styles.listContainer}>
          <Animated.View
            entering={SlideInDown.springify().damping(16)}
            style={styles.list}
          >
            <HorizontalCarousel
              data={posts}
              renderItem={renderItem}
              itemWidth={CELL_POST_WIDTH * 2}
              initialScrollIndex={initialIndex}
              contentContainerStyle={styles.contentContainerStyle}
            />
          </Animated.View>
        </View>
      </View>
    </AnimatedModalBackgroundView>
  );
};

export default UserPostsScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    flex: 1,
  },
  topHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "4%",
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
  },
  list: {
    height: CELL_POST_HEIGHT * 2,
  },
  contentContainerStyle: {
    paddingHorizontal: 12,
    paddingBottom: "4%",
  },
  topHeaderTitle: {
    flex: 1,
    marginRight: "4%",
  },
});
