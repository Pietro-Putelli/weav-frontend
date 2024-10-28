import React, { memo, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { blockUser } from "../../backend/profile";
import { SingleTitleCell } from "../../components/cells";
import { muteChat } from "../../handlers/chats";
import { useCurrentBusiness, useLanguages, useTheme } from "../../hooks";
import {
  getBlockedUsers,
  setBlockedUsers,
} from "../../store/slices/utilityReducer";
import { icons } from "../../styles";

const Chat = ({ chat, onUserBlocked, onShowBadge }) => {
  const theme = useTheme();

  const user = chat?.receiver;

  const dispatch = useDispatch();
  const [muted, setMuted] = useState(chat.muted);

  const blockedUsers = useSelector(getBlockedUsers);
  const isUserBlocked = blockedUsers.includes(user?.id);

  const { languageContent } = useLanguages();
  const { isBusiness } = useCurrentBusiness();

  const languageActions = languageContent.actions;
  const languageActionFeebacks = languageContent.action_feedbacks;

  const onBlockPress = () => {
    blockUser(user.id, (suc) => {
      if (suc) {
        onShowBadge({
          title: isUserBlocked
            ? languageActionFeebacks.unblocked
            : languageActionFeebacks.blocked,
          callback: () => {
            onUserBlocked?.();
          },
        });

        dispatch(
          setBlockedUsers({
            mode: isUserBlocked ? "unblock" : "block",
            id: user.id,
          })
        );
      }
    });
  };

  const onMutedPress = () => {
    dispatch(
      muteChat({ chat, isBusiness }, () => {
        onShowBadge({
          title: muted
            ? languageActionFeebacks.unmuted
            : languageActionFeebacks.muted,
        });
        setMuted(!muted);
      })
    );
  };

  return (
    <View>
      <SingleTitleCell
        title={
          isUserBlocked
            ? languageActions.unblock_user
            : languageActions.block_user
        }
        icon={icons.Block}
        onPress={onBlockPress}
        tintColor={theme.colors.red}
      />

      <SingleTitleCell
        onPress={onMutedPress}
        icon={muted ? icons.NotificationOff : icons.NotificationOn}
        title={muted ? languageActions.unmute_chat : languageActions.mute_chat}
      />
    </View>
  );
};
export default memo(Chat);
