import React, { memo, useCallback } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { removeTagFromMyFeedMoment } from "../../backend/profile";
import { SolidButton } from "../../components/buttons";
import { MainText } from "../../components/texts";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import { decrementMoments } from "../../store/slices/feedsReducer";
import { icons } from "../../styles";
import { showSheetNavigation } from "../../navigation/actions";

const UserTaggedInMomentActions = ({ momentId, setVisible }) => {
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const onRemoveTagPress = useCallback(() => {
    dispatch(decrementMoments(momentId));

    dispatch(
      removeTagFromMyFeedMoment(momentId, (successful) => {
        if (successful) {
          setVisible(false);
        }
      })
    );
  }, []);

  return (
    <View>
      <View style={{ marginBottom: "6%", marginHorizontal: "2%" }}>
        <MainText font="subtitle-2" align="center">
          {languageContent.remove_mention_content}
        </MainText>
      </View>

      <View style={{ flexDirection: "row" }}>
        <SolidButton
          title={languageContent.actions.remove_mention}
          type="delete"
          icon={icons.Cross}
          flex
          marginRight
          loadingOnPress
          onPress={onRemoveTagPress}
        />

        <SolidButton
          title={"report"}
          icon={icons.Flag}
          onPress={() => {
            showSheetNavigation({ screen: SCREENS.Report });
          }}
        />
      </View>
    </View>
  );
};

export default memo(UserTaggedInMomentActions);
