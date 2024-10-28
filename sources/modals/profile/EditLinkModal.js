import React, { memo, useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../backend/profile";
import { SolidButton } from "../../components/buttons";
import { MainTextInput } from "../../components/inputs";
import { useLanguages, useSearchFashion, useUser } from "../../hooks";
import { triggerHaptic } from "../../utility/haptics";
import { formatLink } from "../../utility/strings";
import { isURL } from "../../utility/validators";
import FullSheetModal from "../FullSheetModal";

const EditLinkModal = () => {
  const user = useUser();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const [isValidLink, setIsValidLink] = useState("");

  const onChange = () => {
    isURL(searchText, (isValidUrl) => {
      setIsValidLink(isValidUrl || searchText == "");
    });
  };

  const { isLoading, searchText, onChangeText } = useSearchFashion({
    onChange,
    initialValue: user.link,
  });

  const onDonePress = () => {
    const formattedLink = formatLink(searchText);

    dispatch(
      updateUserProfile({ link: formattedLink }, (succ) => {
        if (succ) {
          navigation.dismissModal();
          triggerHaptic();
        }
      })
    );
  };

  return (
    <FullSheetModal title={languageContent.actions.edit + " link"}>
      <MainTextInput
        autoFocus
        solid
        keyboardType="url"
        value={searchText}
        onChangeText={onChangeText}
        autoCapitalize="none"
        placeholder="Add link"
      />

      <SolidButton
        title="Done"
        type="done"
        loadingOnPress
        loading={isLoading}
        onPress={onDonePress}
        style={styles.button}
        disabled={!isValidLink}
      />
    </FullSheetModal>
  );
};

export default memo(EditLinkModal);

const styles = StyleSheet.create({
  button: {
    marginTop: "6%",
    width: "70%",
    alignSelf: "center",
  },
});
