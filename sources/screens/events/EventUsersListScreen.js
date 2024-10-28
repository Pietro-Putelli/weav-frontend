import React, { useCallback, useRef } from "react";
import { HorizontalUserProfileCell } from "../../components/cells";
import { HeaderFlatList } from "../../components/containers";
import { MainText } from "../../components/texts";
import querylimits from "../../constants/querylimits";
import { SCREENS } from "../../constants/screens";
import { useEventParticipants, useLanguages } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";

const EventUsersListScreen = ({ eventId, componentId }) => {
  const { users, isLoading, fetchUsers } = useEventParticipants({ eventId });

  const offset = useRef(0);
  const { languageContent } = useLanguages();

  /* Callback */

  const onUserPress = useCallback((user) => {
    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user, isModal: true },
    });
  }, []);

  const onEndReached = useCallback(() => {
    offset.current += querylimits.SIXTEEN;

    fetchUsers(offset.current);
  }, []);

  /* Components */

  const renderItem = useCallback(({ item }) => {
    return <HorizontalUserProfileCell user={item} onPress={onUserPress} />;
  }, []);

  return (
    <HeaderFlatList
      data={users}
      enabledAnimation
      isLoading={isLoading}
      renderItem={renderItem}
      estimatedItemSize={60}
      onEndReached={onEndReached}
      bulkCount={querylimits.SIXTEEN}
      onEndReachedThreshold={0}
      headerProps={{ title: languageContent.your_friends }}
      renderHeader={() => {
        return (
          <MainText
            style={{ marginBottom: "6%", marginHorizontal: "3%" }}
            font="subtitle-1"
            align="center"
          >
            {languageContent.all_friends_who_go_to_event}
          </MainText>
        );
      }}
    />
  );
};

export default EventUsersListScreen;
