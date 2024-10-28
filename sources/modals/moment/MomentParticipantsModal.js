import React, { memo, useCallback, useMemo, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SquareUserProfileCell } from "../../components/cells";
import { AdvancedFlatList } from "../../components/lists";
import { MainText } from "../../components/texts";
import { querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useUser, useMomentParticipants } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import ModalScreen from "../ModalScreen";

const { width } = Dimensions.get("window");
const CELL_SIDE = (width - 24 - 8 * 3) / 4;
const LIST_HEIGHT = (CELL_SIDE + 6) * 4;

const MomentParticipantsModal = ({
  momentId,
  participantsCount,
  componentId,
}) => {
  const offset = useRef(0);

  const { userId: myUserId } = useUser();

  const { languageContent } = useLanguages();

  const { users, isLoading, fetchUsers } = useMomentParticipants({ momentId });

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
    <ModalScreen cursor title={languageContent.participants}>
      <View style={styles.subtitleContainer}>
        <MainText font="subtitle-3">
          {languageContent.partecipate_to_the_moment}
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
    </ModalScreen>
  );
};

export default memo(MomentParticipantsModal);

const styles = StyleSheet.create({
  subtitleContainer: {
    marginTop: -8,
    marginLeft: 8,
  },
  listContainer: {
    marginTop: 16,
  },
});
