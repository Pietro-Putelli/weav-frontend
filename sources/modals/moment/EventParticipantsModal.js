import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { JoinEventButton } from "../../components/buttons";
import { SquareUserProfileCell } from "../../components/cells";
import { AdvancedFlatList } from "../../components/lists";
import { MainText } from "../../components/texts";
import { querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import {
  useEvents,
  useLanguages,
  useMomentParticipants,
  useUser,
} from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import ModalScreen from "../ModalScreen";

const { width } = Dimensions.get("window");
const CELL_SIDE = (width - 24 - 8 * 3) / 4;
const LIST_HEIGHT = (CELL_SIDE + 6) * 4;

const EventParticipantsModal = ({
  eventId,
  imGoing,
  participantsCount,
  componentId,
  onEventJoined,
}) => {
  const { goToEvent } = useEvents({ eventId });

  const offset = useRef(0);

  const [isGoing, setIsGoing] = useState(imGoing);

  const { userId: myUserId } = useUser();

  const { languageContent } = useLanguages();

  const { users, isLoading, fetchUsers } = useMomentParticipants({ eventId });

  const [isVisible, setVisible] = useState(true);

  const listHeight = useMemo(() => {
    if (participantsCount > 8) {
      return LIST_HEIGHT;
    }

    if (participantsCount <= 4) {
      return LIST_HEIGHT / 3.5;
    }

    return LIST_HEIGHT / 2;
  }, [participantsCount]);

  /* Callbacks */

  const _onJoinPress = () => {
    setIsGoing(!isGoing);

    goToEvent(() => {
      onEventJoined?.(!isGoing);

      setVisible(false);
    });
  };

  const onUserPress = (user) => {
    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user },
    });
  };

  const onEndReached = useCallback(() => {
    offset.current += querylimits.EIGHT;

    fetchUsers(offset.current);
  }, [fetchUsers]);

  /* Components */

  const renderItem = useCallback(({ item, index }) => {
    return (
      <SquareUserProfileCell
        user={item}
        index={index}
        side={CELL_SIDE}
        myUserId={myUserId}
        onPress={onUserPress}
      />
    );
  }, []);

  return (
    <ModalScreen
      cursor
      visible={isVisible}
      title={languageContent.participants}
    >
      <View style={styles.subtitleContainer}>
        <MainText font="subtitle-3">
          {languageContent.partecipate_to_the_event}
        </MainText>
      </View>

      <View style={[styles.listContainer, { height: listHeight }]}>
        <AdvancedFlatList
          data={users}
          numColumns={4}
          enabledAnimation
          isLoading={isLoading}
          renderItem={renderItem}
          estimatedItemSize={CELL_SIDE}
          bulkCount={querylimits.EIGHT}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{ paddingBottom: 0 }}
        />
      </View>

      <JoinEventButton
        isActive={isGoing}
        onPress={_onJoinPress}
        style={{ marginTop: "3%" }}
      />
    </ModalScreen>
  );
};

export default memo(EventParticipantsModal);

const styles = StyleSheet.create({
  subtitleContainer: {
    marginTop: -8,
    marginLeft: 8,
  },
  listContainer: {
    marginTop: 16,
  },
});
