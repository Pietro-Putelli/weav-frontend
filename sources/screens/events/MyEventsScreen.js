import React, { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { FadeAnimatedView } from "../../components/animations";
import { HeaderFlatList } from "../../components/containers";
import { MyEventsCell } from "../../components/events";
import { MyEventsPlaceholder } from "../../components/placeholders";
import { MainText } from "../../components/texts";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useMyEvents } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";

const MyEventsScreen = ({ componentId }) => {
  const { events, isLoading, isNotFound, isRefreshing, refreshEvents } =
    useMyEvents();

  const { languageContent } = useLanguages();

  const headerProps = useMemo(() => {
    return {
      title: languageContent.my_events,
    };
  }, []);

  /* Callbacks */

  const onDetailPress = (event) => {
    pushNavigation({
      componentId,
      screen: SCREENS.EventDetail,
      passProps: { eventId: event.id },
    });
  };

  /* Components */

  const renderEmptyComponent = () => {
    if (isNotFound) {
      return <MyEventsPlaceholder />;
    }

    return null;
  };

  const renderSectionHeader = ({ section }) => {
    return (
      <FadeAnimatedView mode={"fade-right"} style={styles.section}>
        <MainText font="subtitle-4" bold uppercase>
          {section.title}
        </MainText>
      </FadeAnimatedView>
    );
  };

  const renderItem = useCallback(
    ({ item }) => {
      return <MyEventsCell event={item} onDetailPress={onDetailPress} />;
    },
    [onDetailPress]
  );

  return (
    <HeaderFlatList
      enabledAnimation
      data={events}
      isLoading={isLoading}
      renderItem={renderItem}
      isNotFound={isNotFound}
      isRefreshing={isRefreshing}
      headerProps={headerProps}
      onRefresh={refreshEvents}
      renderSectionHeader={renderSectionHeader}
      renderEmptyComponent={renderEmptyComponent}
    />
  );
};

export default MyEventsScreen;

const styles = StyleSheet.create({
  section: {
    marginLeft: 2,
    marginBottom: 12,
  },
});
