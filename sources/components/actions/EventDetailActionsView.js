import React, { memo, useMemo } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import {
  pushNavigation,
  showModalNavigation,
  showSheetNavigation,
  showStackModal,
} from "../../navigation/actions";
import { icons } from "../../styles";
import { openInstagram } from "../../utility/linking";
import EventDetailActionCell from "./EventDetailActionCell";

const EventDetailActionsView = ({
  onGoPress,
  event,
  componentId,
  ...props
}) => {
  const onActionPress = (action) => {
    switch (action) {
      case "repost":
        showStackModal({
          screen: SCREENS.CreateMoment,
          passProps: {
            initialMoment: { event },
          },
        });
        break;

      case "send":
        showModalNavigation({
          screen: SCREENS.Share,
          passProps: { event },
        });
        break;

      case "location":
        showSheetNavigation({
          screen: SCREENS.MapSelector,
          passProps: { ...event.location, name: event.title },
        });
        break;

      case "instagram":
        openInstagram(event.instagram);
        break;

      case "link":
        pushNavigation({
          componentId,
          screen: SCREENS.Web,
          passProps: { url: event.website },
        });
        break;

      case "contact":
        pushNavigation({
          componentId,
          screen: SCREENS.ChatMessage,
          passProps: {
            business: event.business,
          },
        });
        break;
    }
  };

  const instagram = event?.instagram;
  const website = event?.website;

  const { languageContent } = useLanguages();

  const caseActions = useMemo(() => {
    const actions = languageContent.actions;

    return [
      // { title: actions.i_will_go, icon: icons.Play },
      {
        title: actions.repost,
        icon: icons.Repost,
        action: "repost",
      },
      { title: actions.share, icon: icons.ShareEmpty, action: "send" },
      { title: actions.map, icon: icons.Marker1, action: "location" },
      { title: actions.contact, icon: icons.Paperplane, action: "contact" },
      { title: "instagram", icon: icons.Instagram, action: "instagram" },
      { title: "website", icon: icons.Link, action: "link" },
    ];
  }, []);

  const actions = useMemo(() => {
    const keysToRemove = [];

    if (!instagram) {
      keysToRemove.push("instagram");
    }

    if (!website) {
      keysToRemove.push("link");
    }

    return caseActions.filter(({ action }) => {
      return !keysToRemove.includes(action);
    });
  }, [event]);

  return (
    <View style={{ marginTop: "2%" }} {...props}>
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 8 }}
        showsHorizontalScrollIndicator={false}
      >
        {actions.map((action, index) => {
          const sharedProps = { ...action, key: index, index };

          // if (index == 0) {
          //   return (
          //     <EventDetailGoActionCell
          //       isGoing={event?.is_going}
          //       onPress={onGoPress}
          //       {...sharedProps}
          //     />
          //   );
          // }

          const isLast = index == actions.length - 1;

          return (
            <EventDetailActionCell
              onPress={onActionPress}
              style={{ marginRight: isLast ? 0 : 16 }}
              {...sharedProps}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(EventDetailActionsView);
