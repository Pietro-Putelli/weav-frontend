import React, { memo, useState } from "react";
import { View } from "react-native";
import { Navigation } from "react-native-navigation";
import { SingleTitleCell } from "../../components/cells";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { triggerHaptic } from "../../utility/haptics";
import { copyLinkFor } from "../../utility/shareApis";
import DoubleOptionPopupModal from "../popups/DoubleOptionPopupModal";

const VenueMore = ({ setVisible, onShowBadge, businessId }) => {
  const { languageContent } = useLanguages();

  const [visiblePopup, setVisiblePopup] = useState(false);

  const onCopyLinkPress = () => {
    onShowBadge({ title: languageContent.action_feedbacks.copied });

    copyLinkFor({ businessId });

    setTimeout(() => {
      setVisible(false);
    }, 500);
  };

  return (
    <>
      <View>
        <SingleTitleCell
          title={languageContent.actions.report}
          icon={icons.Flag}
          onPress={() => {
            showSheetNavigation({ screen: SCREENS.Report });
          }}
        />
        <SingleTitleCell
          haptic
          title={languageContent.actions.copy_link}
          icon={icons.Link}
          onPress={onCopyLinkPress}
        />
      </View>

      <DoubleOptionPopupModal
        title={languageContent.popup_contents.report_business}
        visible={visiblePopup}
        setVisible={setVisiblePopup}
        onDonePress={() => {
          setTimeout(() => {
            setVisiblePopup(false);
            Navigation.dismissAllModals();

            triggerHaptic();
          }, 100);
        }}
      />
    </>
  );
};
export default memo(VenueMore);
