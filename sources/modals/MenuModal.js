import React, { useMemo, useState } from "react";
import { ConfirmView } from "../components/badgeviews";
import { actiontypes } from "../constants";

import {
  Chat,
  Discusison,
  EditPost,
  EventDetailMore,
  EventMatch,
  EventOptions,
  PostSort,
  SpotDetails,
  UserProfile,
  UserTagEventActions,
  UserTaggedInMomentActions,
  VenueMore,
} from "./menumodal";

import ModalScreen from "./ModalScreen";

const {
  MENU_MODAL: {
    POST_MORE,
    POST_SORT,
    VENUE_MORE,
    CHAT,
    DISCUSSION,
    PROFILE_PICTURE,
    USER_PROFILE,
    EDIT_POST,
    MOMENT_MENU,
    USER_TAGGED_EVENT_MOMENT,
    EVENT_MOMENT_OPTIONS,
    USER_TAGGED_IN_MOMENT,
    EVENT_DETAIL_MORE,
    SPOT_DETAIL,
    EVENT_MATCH,
  },
} = actiontypes;

const MenuModal = ({ type, ...props }) => {
  const [visible, setVisible] = useState();

  const [badgeVisible, setBadgeVisible] = useState(false);

  /* Used for badge and popup */
  const [title, setTitle] = useState("");

  const onShowBadge = ({ title, callback }) => {
    setTitle(title);
    setBadgeVisible(true);

    setTimeout(() => {
      callback?.();
      setVisible(false);
    }, 400);
  };

  const sharedProps = {
    setVisible,
    onShowBadge,
    ...props,
  };

  const Component = useMemo(() => {
    switch (type) {
      case POST_SORT:
        return PostSort;
      case VENUE_MORE:
        return VenueMore;
      case CHAT:
        return Chat;
      case DISCUSSION:
        return Discusison;
      case PROFILE_PICTURE:
        return ProfilePictureOptions;
      case USER_PROFILE:
        return UserProfile;
      case EDIT_POST:
        return EditPost;
      case USER_TAGGED_EVENT_MOMENT:
        return UserTagEventActions;
      case EVENT_MOMENT_OPTIONS:
        return EventOptions;
      case USER_TAGGED_IN_MOMENT:
        return UserTaggedInMomentActions;
      case EVENT_DETAIL_MORE:
        return EventDetailMore;
      case SPOT_DETAIL:
        return SpotDetails;
      case EVENT_MATCH:
        return EventMatch;
      default:
        return null;
    }
  }, [sharedProps]);

  return (
    <>
      <ModalScreen cursor visible={visible}>
        <Component {...sharedProps} />
      </ModalScreen>

      <ConfirmView
        title={title}
        visible={badgeVisible}
        setVisible={setBadgeVisible}
      />
    </>
  );
};
export default MenuModal;
