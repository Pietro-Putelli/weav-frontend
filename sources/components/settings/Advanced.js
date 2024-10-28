import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import {
  PRIVACY_POLICY_URL,
  TERMS_AND_CONDITIONS_URL,
  THIRD_PARTY_URL,
  WEB_URL,
} from "../../backend/urls";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { deleteUserAccount, userLogOut } from "../../handlers/user";
import { useLanguages } from "../../hooks";
import { DoubleOptionPopupModal } from "../../modals";
import { pushNavigation, showSheetNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { contactSupport } from "../../utility/linking";
import { SolidButton } from "../buttons";
import { SingleTitleCell, VersionCell } from "../cells";
import { MainScrollView } from "../containers";
import { SeparatorTitle } from "../separators";

const { BLOCKED_USERS, NOTIFICATIONS } = actiontypes.SETTINGS;

const Advanced = ({ componentId }) => {
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const [visible, setVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const onLogOutPress = () => {
    dispatch(userLogOut());
  };

  const onSyncBusinessPress = () => {};

  const pushToWeb = (type) => {
    let url = "";

    switch (type) {
      case "website":
        url = WEB_URL;
        break;
      case "terms":
        url = TERMS_AND_CONDITIONS_URL;
        break;
      case "privacy":
        url = PRIVACY_POLICY_URL;
        break;
      case "third":
        url = THIRD_PARTY_URL;
        break;
    }

    pushNavigation({
      componentId,
      screen: SCREENS.Web,
      passProps: { url },
    });
  };

  const pushSetting = (type) => {
    pushNavigation({
      componentId,
      screen: SCREENS.Settings,
      passProps: { type },
    });
  };

  const onDeleteAccountPress = () => {
    deleteUserAccount();
  };

  return (
    <>
      <MainScrollView title={languageContent.settings}>
        <SeparatorTitle>app</SeparatorTitle>
        <SingleTitleCell
          title={languageContent.notification}
          icon={icons.NotificationOn}
          style={styles.cell}
          onPress={() => {
            pushSetting(NOTIFICATIONS);
          }}
        />
        <SingleTitleCell
          title={languageContent.blocked_users}
          icon={icons.Block}
          style={styles.cell}
          onPress={() => {
            pushSetting(BLOCKED_USERS);
          }}
        />
        <SingleTitleCell
          title={languageContent.language}
          icon={icons.Languages}
          style={styles.cell}
          onPress={() => {
            showSheetNavigation({
              screen: SCREENS.Languages,
            });
          }}
        />
        <SeparatorTitle>
          {languageContent.separator_titles.useful}
        </SeparatorTitle>
        <SingleTitleCell
          title={languageContent.report_issue}
          icon={icons.Flag}
          style={styles.cell}
          onPress={() => {
            contactSupport();
          }}
        />
        <SingleTitleCell
          title={languageContent.official_website}
          icon={icons.Link}
          style={styles.cell}
          onPress={() => {
            pushToWeb("website");
          }}
        />
        <SeparatorTitle>
          {languageContent.separator_titles.legal}
        </SeparatorTitle>
        <SingleTitleCell
          title={languageContent.terms_and_conditions}
          icon={icons.Terms}
          style={styles.cell}
          onPress={() => {
            pushToWeb("terms");
          }}
        />
        <SingleTitleCell
          title={"Privacy Policy"}
          icon={icons.Privacy}
          style={styles.cell}
          onPress={() => {
            pushToWeb("privacy");
          }}
        />
        <SingleTitleCell
          title={languageContent.third_part_libraries}
          icon={icons.Tag}
          style={styles.cell}
          onPress={() => {
            pushToWeb("third");
          }}
        />
        <SeparatorTitle>account</SeparatorTitle>

        <SingleTitleCell
          title={languageContent.delete_account}
          icon={icons.Bin}
          style={styles.cell}
          onPress={() => {
            setDeletePopupVisible(true);
          }}
        />
        <SolidButton
          title={languageContent.buttons.logout}
          style={{ marginTop: "4%" }}
          onPress={() => {
            setVisible(true);
          }}
        />
        <VersionCell />
      </MainScrollView>

      <DoubleOptionPopupModal
        title="log out?"
        visible={visible}
        setVisible={setVisible}
        onDonePress={onLogOutPress}
      />

      <DoubleOptionPopupModal
        doneType="delete"
        title={languageContent.popup_contents.delete_account}
        visible={deletePopupVisible}
        setVisible={setDeletePopupVisible}
        onDonePress={onDeleteAccountPress}
      />
    </>
  );
};

export default Advanced;

const styles = StyleSheet.create({
  cell: {
    marginTop: 0,
    marginBottom: "3%",
  },
});
