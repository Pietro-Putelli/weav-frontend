import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { HorizontalUserProfileCell } from "../../components/cells";
import { SolidSearchBar } from "../../components/inputs";
import { AdvancedFlatList } from "../../components/lists";
import { MainText } from "../../components/texts";
import { querylimits } from "../../constants";
import { useLanguages, useSearchUsers } from "../../hooks";
import { TAB_BAR_HEIGHT } from "../../styles/sizes";
import { includesById } from "../../utility/collections";
import FullSheetModal from "../FullSheetModal";

const AddParticipantsModal = ({ moment, onParticipantsChanged }) => {
  const {
    users,
    fetchUsers,
    isNotFound,
    isLoadingMore,
    onEndReached,
    ...searchProps
  } = useSearchUsers({ limit: querylimits.EIGHT });

  const { languageContent } = useLanguages();

  const initialParticipants = moment.participants ?? [];

  const [participants, setParticipants] = useState(initialParticipants);

  const onUserPress = (user) => {
    const isSelected = includesById(participants, user);

    let _participants = [];

    if (isSelected) {
      _participants = participants.filter((u) => u.id !== user.id);
    } else {
      _participants = [...participants, user];
    }

    setParticipants(_participants);
    onParticipantsChanged(_participants);
  };

  const renderItem = useCallback(
    ({ item }) => {
      const selected = includesById(participants, item);

      return (
        <HorizontalUserProfileCell
          user={item}
          selected={selected}
          onPress={onUserPress}
        />
      );
    },
    [participants]
  );

  const ListHeaderComponent = useMemo(() => {
    return (
      <View style={styles.header}>
        <MainText align="center" font="subtitle-1">
          Add participants to your moment
        </MainText>
      </View>
    );
  }, []);

  return (
    <FullSheetModal>
      <SolidSearchBar
        autoFocus
        placeholder={languageContent.text_placeholders.type_username}
        {...searchProps}
      />

      <View style={styles.listContainer}>
        <AdvancedFlatList
          data={users}
          extraData={users}
          enabledAnimation
          renderItem={renderItem}
          onEndReached={onEndReached}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          isLoading={isLoadingMore}
          bulkCount={querylimits.EIGHT}
          contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
          ListHeaderComponent={ListHeaderComponent}
        />
      </View>
    </FullSheetModal>
  );
};

export default AddParticipantsModal;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: "4%",
  },
  header: {
    marginBottom: "4%",
  },
});
