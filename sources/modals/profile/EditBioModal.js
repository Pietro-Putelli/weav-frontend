import React, { memo, useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../backend/profile";
import { SolidButton } from "../../components/buttons";
import { TextView } from "../../components/inputs";
import { useLanguages, useUser } from "../../hooks";
import { removeAllNewEmptyLines } from "../../utility/strings";
import FullSheetModal from "../FullSheetModal";

const HEIGHT = RFPercentage(30);

const EditBioModal = () => {
  const { bio } = useUser();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const [userBio, setUserBio] = useState(bio);

  const onDonePress = () => {
    const formattedBio = removeAllNewEmptyLines(userBio);

    dispatch(
      updateUserProfile({ bio: formattedBio }, (succ) => {
        succ && navigation.dismissModal();
      })
    );
  };

  return (
    <FullSheetModal title={languageContent.actions.edit + " bio"}>
      <TextView
        value={userBio}
        placeholder="Add little bio here"
        autoFocus
        solid
        clearButton
        height={HEIGHT}
        maxLength={100}
        onChangeText={(value) => {
          setUserBio(value);
        }}
      />

      <SolidButton
        title="Done"
        type="done"
        loadingOnPress
        style={styles.button}
        onPress={onDonePress}
      />
    </FullSheetModal>
  );
};

export default memo(EditBioModal);

const styles = StyleSheet.create({
  button: {
    marginTop: "6%",
    width: "70%",
    alignSelf: "center",
  },
});
