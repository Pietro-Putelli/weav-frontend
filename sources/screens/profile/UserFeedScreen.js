import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { FadeAnimatedView } from "../../components/animations";
import { TabListView } from "../../components/containers";
import { FriendsRequestsFeed, MomentsFeed } from "../../components/feeds";
import { HeaderTitle } from "../../components/headers";
import { EdgeBackGestureView } from "../../components/views";
import { useLanguages, useMyFeeds } from "../../hooks";

const UserFeedScreen = ({ componentId }) => {
  /* Props */
  const scrollY = useSharedValue(0);
  const { languageContent } = useLanguages();
  const { momentsCount, requestsCount } = useMyFeeds();

  const sharedProps = { scrollY, componentId };

  const choices = useMemo(() => {
    return [
      {
        title: languageContent.mention,
        component: <MomentsFeed {...sharedProps} />,
        count: momentsCount,
      },
      {
        title: languageContent.requests,
        component: <FriendsRequestsFeed {...sharedProps} />,
        count: requestsCount,
      },
    ];
  }, [momentsCount, requestsCount]);

  /* Callbacks */

  return (
    <View style={styles.container}>
      <EdgeBackGestureView />

      <View style={styles.header}>
        <HeaderTitle
          headerY={scrollY}
          title={languageContent.header_titles.feeds}
        />
      </View>

      <FadeAnimatedView style={{ flex: 1 }}>
        <TabListView choices={choices} />
      </FadeAnimatedView>
    </View>
  );
};

export default UserFeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    zIndex: 10,
    position: "absolute",
  },
});
