import { View } from "moti";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { SCREENS } from "../../constants/screens";
import { pushNavigation, showSheetNavigation } from "../../navigation/actions";
import { getFeedsTotalUnreadCount } from "../../store/slices/feedsReducer";
import { icons } from "../../styles";
import { BadgeButton, IconButton } from "../buttons";

const MyProfileRightComponent = ({ componentId }) => {
  const feedCount = useSelector(getFeedsTotalUnreadCount);

  return (
    <View style={{ flexDirection: "row" }}>
      <BadgeButton
        color="white"
        count={feedCount}
        source={icons.Feed}
        style={{ marginRight: 16 }}
        onPress={() => {
          pushNavigation({
            componentId,
            screen: SCREENS.UserFeed,
          });
        }}
      />

      <IconButton
        color="white"
        source={icons.Menu}
        inset={1}
        onPress={() => {
          showSheetNavigation({
            screen: SCREENS.ProfileStuffs,
            passProps: { pushComponentId: componentId },
          });
        }}
      />
    </View>
  );
};

export default memo(MyProfileRightComponent);
