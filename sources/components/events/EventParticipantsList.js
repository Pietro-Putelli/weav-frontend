import { isEmpty } from "lodash";
import React, { memo, useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useTheme } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { UserProfileCell } from "../cells";
import { AdvancedFlatList } from "../lists";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";
import { BounceView } from "../views";

const { width } = Dimensions.get("window");
const CELL_SIDE = (width - 32 - 16 * 4) / 5;

const EventParticipantsList = ({ componentId, participants, onMorePress }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const { users, count } = participants;
  const areUsersEmpty = isEmpty(users);

  const formattedUsers = useMemo(() => {
    const newCount = Math.max(0, count - 4);

    if (newCount > 0) {
      return [...users, { count: newCount }];
    }

    return users;
  }, [participants]);

  /* Styles */

  const moreContainerStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.container,
      ...styles.moreContainer,
    };
  }, []);

  /* Callbacks */

  const onUserPress = useCallback((user) => {
    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user },
    });
  }, []);

  /* Components */

  const renderItem = useCallback(
    ({ item }) => {
      if (item?.count) {
        return (
          <BounceView onPress={onMorePress} style={moreContainerStyle}>
            <MainText font="title-7" bold style={{ bottom: 1 }}>
              +{item.count}
            </MainText>
          </BounceView>
        );
      }

      return (
        <UserProfileCell
          user={item}
          side={CELL_SIDE}
          onPress={onUserPress}
          style={styles.cellContainer}
        />
      );
    },
    [onUserPress, onMorePress]
  );

  if (areUsersEmpty) {
    return null;
  }

  return (
    <>
      <SeparatorTitle>{languageContent.your_friends}</SeparatorTitle>

      <View style={styles.listContainer}>
        <AdvancedFlatList
          data={formattedUsers}
          horizontal
          enabledAnimation
          renderItem={renderItem}
          scrollEnabled={false}
          estimatedItemSize={CELL_SIDE}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      </View>
    </>
  );
};

export default memo(EventParticipantsList);

const styles = StyleSheet.create({
  listContainer: {
    marginTop: "1%",
    height: CELL_SIDE * 1.6,
  },
  container: {
    width: CELL_SIDE,
    height: CELL_SIDE,
    borderRadius: CELL_SIDE / 2.2,
    overflow: "hidden",
  },
  moreContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cellContainer: {
    marginRight: 16,
    width: CELL_SIDE,
  },
});
