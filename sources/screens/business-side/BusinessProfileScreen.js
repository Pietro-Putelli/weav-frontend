import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { WEB_URL } from "../../backend/urls";
import { SolidButton } from "../../components/buttons";
import { SingleTitleCell, VersionCell } from "../../components/cells";
import { MainScrollView } from "../../components/containers";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { switchToPersonalProfile, userLogOut } from "../../handlers/user";
import { useLanguages, useUser } from "../../hooks";
import { DoubleOptionPopupModal } from "../../modals";
import {
  pushNavigation,
  showModalNavigation,
  showSheetNavigation,
} from "../../navigation/actions";
import { icons } from "../../styles";

const BusinessProfileScreen = ({ componentId }) => {
  const dispatch = useDispatch();

  const { hasProfile, userId, secretInfo, hasMultipleBusinesses } = useUser();

  const { languageContent } = useLanguages();

  const [visiblePopup, setVisiblePopup] = useState(false);

  const items = useMemo(() => {
    return [
      // {
      //   title: "Qr code scanner",
      //   icon: icons.QrCode,
      //   type: actiontypes.SETTINGS.QR_CODE,
      // },
      {
        title: languageContent.messages,
        icon: icons.Paperplane,
        type: actiontypes.SETTINGS.MESSAGES,
      },
      {
        title: languageContent.notification,
        icon: icons.NotificationOn,
        type: actiontypes.SETTINGS.NOTIFICATIONS,
      },
      {
        title: languageContent.language,
        icon: icons.Languages,
        type: "languages",
      },
      {
        title: languageContent.contact_us,
        icon: icons.Phone,
        type: "contact",
      },
      {
        title: "logout",
        icon: icons.Logout,
        type: "logout",
      },
    ];
  }, [languageContent]);

  const onItemPress = ({ type, title }) => {
    if (type == actiontypes.SETTINGS.QR_CODE) {
      showModalNavigation({
        fullscreen: true,
        screen: SCREENS.QrScanner,
      });
    } else if (type == "delete") {
      showModalNavigation({ screen: SCREENS.DeleteVenue });
    } else if (type == "contact") {
      showModalNavigation({
        screen: SCREENS.ContactUs,
      });
    } else if (type == "web") {
      pushNavigation({
        componentId,
        screen: SCREENS.Web,
        passProps: { url: WEB_URL },
      });
    } else if (type == "languages") {
      showSheetNavigation({
        screen: SCREENS.Languages,
      });
    } else if (type == "delete") {
      showModalNavigation({
        screen: SCREENS.DeleteVenue,
      });
    } else if (type == "logout") {
      setVisiblePopup(true);
    } else {
      pushNavigation({
        componentId,
        screen: SCREENS.Settings,
        passProps: { type, title },
      });
    }
  };

  const createUserProfile = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.Username,
      passProps: { isProfileSignup: true },
    });
  };

  const onSwitchPress = () => {
    if (hasMultipleBusinesses) {
      showSheetNavigation({
        screen: SCREENS.MyProfilesList,
        passProps: { componentId, onCreateUserPress: createUserProfile },
      });
    } else {
      dispatch(
        switchToPersonalProfile(
          { hasProfile, userId, secretInfo },
          createUserProfile
        )
      );
    }
  };

  const onLogoutDone = () => {
    dispatch(userLogOut());
  };

  return (
    <>
      <MainScrollView
        isBottomBarVisible
        title={languageContent.header_titles.profile}
        noBack
      >
        {items.map(({ title, icon, type }, index) => {
          return (
            <SingleTitleCell
              title={title}
              icon={icon}
              key={title}
              onPress={() => onItemPress({ type, title })}
              style={{ marginTop: index == 0 ? 0 : "3%" }}
            />
          );
        })}

        <SolidButton
          icon={icons.Change}
          onPress={onSwitchPress}
          type="done"
          style={{ marginTop: "4%" }}
          title={
            languageContent[
              hasMultipleBusinesses ? "switch_profile" : "switch_to_personal"
            ]
          }
        />

        <VersionCell />
      </MainScrollView>

      <DoubleOptionPopupModal
        doneType="delete"
        doneTitle="log out"
        onDonePress={onLogoutDone}
        visible={visiblePopup}
        setVisible={setVisiblePopup}
        title={languageContent.popup_contents.log_out}
      />
    </>
  );
};
export default BusinessProfileScreen;
