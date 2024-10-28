import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FadeAnimatedView } from "../../components/animations";
import { ToastAlertView } from "../../components/badgeviews";
import { HeaderFlatList } from "../../components/containers";
import { SquareImage } from "../../components/images";
import { EventCell } from "../../components/moments";
import { MyEventsPlaceholder } from "../../components/placeholders";
import { MainText } from "../../components/texts";
import {
  useFocusEffect,
  useLanguages,
  useMyEvents,
  useTheme,
} from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";

const UserEventsScreen = ({ componentId }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const { events, isLoading, isNotFound, setIsNotFound } = useMyEvents();

  const [discussionVisible, setDiscussionVisible] = useState(false);

  useFocusEffect((isFocused) => {
    if (isFocused && sections.length === 0) {
      setIsNotFound(true);
    }
  });

  /* Props */

  const sections = useMemo(() => {
    return Object.keys(events)
      .sort((key1, key2) => {
        const date1 = new Date(key1);
        const date2 = new Date(key2);

        return date1 - date2;
      })
      .map((date) => {
        const formattedDate = moment(date);

        const today = moment();
        const tomorrow = moment().add(1, "day");

        let title = date;

        if (formattedDate.isSame(today, "day")) {
          title = languageContent.today;
        } else if (formattedDate.isSame(tomorrow, "day")) {
          title = languageContent.tomorrow;
        }

        return {
          title,
          data: events[date],
        };
      })
      .filter((section) => section.data.length > 0);
  }, [events]);

  const headerProps = useMemo(() => {
    return {
      title: languageContent.my_events,
      componentId,
    };
  }, [languageContent]);

  const onEventJoined = useCallback(
    (isGoing) => {
      if (isGoing) {
        setDiscussionVisible(true);
      } else if (sections.length === 1) {
        setIsNotFound(true);
      }
    },
    [sections]
  );

  /* Components */

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <FadeAnimatedView style={styles.eventContainer}>
          <EventCell
            moment={item}
            componentId={componentId}
            onEventJoined={onEventJoined}
          />
        </FadeAnimatedView>
      );
    },
    [onEventJoined]
  );

  const renderSectionHeader = useCallback(({ section }) => {
    return (
      <FadeAnimatedView
        mode="fade-right"
        style={[styles.sectionHeaderContainer, theme.styles.shadow_round]}
      >
        <SquareImage
          side={ICON_SIZES.two}
          source={icons.Arrows.Right}
          style={{ marginRight: "3%" }}
        />
        <MainText uppercase font="subtitle" style={{ fontSize: 18 }} isNumbers>
          {section.title}
        </MainText>
      </FadeAnimatedView>
    );
  }, []);

  const keyExtractor = useCallback((item) => item.title, []);

  const renderEmptyComponent = useCallback(() => {
    if (isNotFound) {
      return <MyEventsPlaceholder />;
    }
    return null;
  }, [isNotFound]);

  return (
    <View style={styles.container}>
      <HeaderFlatList
        removeMargin
        sections={sections}
        isLoading={isLoading}
        renderItem={renderItem}
        headerProps={headerProps}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        renderEmptyComponent={renderEmptyComponent}
      />

      <ToastAlertView
        isTop
        hapticDisabled
        icon={icons.ColoredChat}
        visible={discussionVisible}
        setVisible={setDiscussionVisible}
      >
        {languageContent.added_to_event_discussion}
      </ToastAlertView>
    </View>
  );
};

export default UserEventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeaderContainer: {
    padding: "3%",
    paddingHorizontal: "5%",
    marginBottom: "3%",
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    marginLeft: "1%",
  },
  eventContainer: {
    marginBottom: "3%",
  },
});
