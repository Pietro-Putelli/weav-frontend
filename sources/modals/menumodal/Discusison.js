import React from "react";
import { View } from "react-native";
import { SingleTitleCell } from "../../components/cells";
import { icons } from "../../styles";
import { useLanguages } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { SCREENS } from "../../constants/screens";
import { useDispatch } from "react-redux";
import { muteDiscussion } from "../../backend/discussions";

const Discusison = ({ chat, onShowBadge }) => {
  const { languageContent } = useLanguages();
  const languageActions = languageContent.actions;
  const languageActionFeebacks = languageContent.action_feedbacks;

  const dispatch = useDispatch();

  const isMuted = chat?.muted;

  const onMutedPress = () => {
    dispatch(
      muteDiscussion(chat, (isDone) => {
        if (isDone) {
          onShowBadge({
            title: isMuted
              ? languageActionFeebacks.unmuted
              : languageActionFeebacks.muted,
          });
        }
      })
    );
  };

  return (
    <View>
      <SingleTitleCell
        onPress={onMutedPress}
        icon={isMuted ? icons.NotificationOff : icons.NotificationOn}
        title={
          isMuted ? languageActions.unmute_chat : languageActions.mute_chat
        }
      />
      <SingleTitleCell
        title={languageActions.report}
        icon={icons.Flag}
        onPress={() => {
          showSheetNavigation({ screen: SCREENS.Report });
        }}
      />
    </View>
  );
};

export default Discusison;
