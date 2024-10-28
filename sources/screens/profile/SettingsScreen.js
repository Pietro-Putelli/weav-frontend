import React from "react";
import {
  Advanced,
  BlockedUsers,
  FriendsList,
  LikedVenues,
  Messages,
  Notifications,
  UserChances,
} from "../../components/settings";
import { actiontypes } from "../../constants/";

const {
  SETTINGS: {
    FRIENDS_LIST,
    LIKED_VENUES,
    ADVANCED,
    NOTIFICATIONS,
    BLOCKED_USERS,
    CHANCES,
    MESSAGES,
  },
} = actiontypes;

const SettingsScreen = ({ type, ...props }) => {
  switch (type) {
    case FRIENDS_LIST:
      return <FriendsList {...props} />;
    case LIKED_VENUES:
      return <LikedVenues {...props} />;
    case CHANCES:
      return <UserChances {...props} />;
    case MESSAGES:
      return <Messages {...props} />;
    case ADVANCED:
      return <Advanced {...props} />;
    case NOTIFICATIONS:
      return <Notifications {...props} />;
    case BLOCKED_USERS:
      return <BlockedUsers {...props} />;
    default:
      return <></>;
  }
};
export default SettingsScreen;
