import { isNull } from "lodash";
import React, { memo, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { blockUser } from "../../backend/profile";
import { SingleTitleCell } from "../../components/cells";
import { SeparatorTitle } from "../../components/separators";
import { SCREENS } from "../../constants/screens";
import { useCurrentBusiness, useLanguages, useTheme } from "../../hooks";
import {
  showModalNavigation,
  showSheetNavigation,
} from "../../navigation/actions";
import {
  getBlockedUsers,
  setBlockedUsers,
} from "../../store/slices/utilityReducer";
import { icons } from "../../styles";
import { openInstagram } from "../../utility/linking";

const UserProfile = ({ onShowBadge, profile }) => {
  const { instagram, link, id } = profile;

  const { languageContent } = useLanguages();

  const languageContentActionFeedback = languageContent.action_feedbacks;
  const languageContentSeparators = languageContent.separator_titles;
  const languageContentActions = languageContent.actions;

  const blockedUsers = useSelector(getBlockedUsers);
  const isUserBlocked = blockedUsers.includes(id);
  const { isBusiness } = useCurrentBusiness();

  const theme = useTheme();
  const dispatch = useDispatch();

  const [blocked, setBlocked] = useState(isUserBlocked);

  const someContactsExist = !isNull(instagram) || !isNull(link);

  const onBlockPress = () => {
    blockUser(id, (suc) => {
      if (suc) {
        onShowBadge({
          title: blocked
            ? languageContentActionFeedback.unblocked
            : languageContentActionFeedback.blocked,
        });

        dispatch(setBlockedUsers({ mode: blocked ? "unblock" : "block", id }));

        setBlocked(!blocked);
      }
    });
  };

  const onSharePress = () => {
    showModalNavigation({
      screen: SCREENS.Share,
      fullscreen: false,
      passProps: { profileId: id },
    });
  };

  const onLinkPress = () => {
    showModalNavigation({
      screen: SCREENS.Web,
      passProps: {
        url: link,
        isModal: true,
      },
    });
  };

  return (
    <>
      {someContactsExist && (
        <View style={{ marginTop: "-3%", marginBottom: "3%" }}>
          <SeparatorTitle noBottom>
            {languageContentSeparators.about}
          </SeparatorTitle>

          {!isNull(instagram) && (
            <SingleTitleCell
              title={instagram}
              icon={icons.Instagram}
              textStyle={{ textTransform: "none" }}
              onPress={() => {
                openInstagram(instagram);
              }}
            />
          )}

          {link != null && (
            <SingleTitleCell
              title={link}
              icon={icons.Link}
              textStyle={{ textTransform: "none" }}
              onPress={onLinkPress}
            />
          )}

          <SeparatorTitle noBottom marginTop>
            {languageContentSeparators.actions}
          </SeparatorTitle>
        </View>
      )}

      <View>
        {!isBusiness && (
          <SingleTitleCell
            style={{ marginTop: 0 }}
            title={languageContentActions.share_profile}
            icon={icons.ShareEmpty}
            onPress={onSharePress}
          />
        )}

        <SingleTitleCell
          title={
            !blocked
              ? languageContentActions.block_user
              : languageContentActions.unblock_user
          }
          icon={icons.Block}
          onPress={onBlockPress}
          tintColor={theme.colors.red}
        />

        <SingleTitleCell
          title={languageContentActions.report_user}
          icon={icons.Flag}
          onPress={() => {
            showSheetNavigation({ screen: SCREENS.Report });
          }}
        />
      </View>
    </>
  );
};
export default memo(UserProfile);
