import React, { useMemo, useState } from "react";
import { actiontypes } from "../constants";
import ModalScreen from "./ModalScreen";
import {
  ActivateNotification,
  ActivityEventsInfo,
  UserProfileTutorial,
} from "./tutorials";
import { useLanguages } from "../hooks";

const { USER_PROFILE, NOTIFICATIONS, ACTIVITY_EVENTS } = actiontypes.TUTORIAL;

const TutorialModal = ({ type, ...props }) => {
  const [visible, setVisible] = useState();

  const { languageContent } = useLanguages();

  const { Component, modalProps } = useMemo(() => {
    let modalProps = {};

    switch (type) {
      case USER_PROFILE:
        modalProps = {
          disabled: false,
        };

        return { Component: UserProfileTutorial, modalProps };
      case NOTIFICATIONS:
        modalProps = {
          disabled: true,
        };

        return { Component: ActivateNotification, modalProps };

      case ACTIVITY_EVENTS:
        modalProps = {
          cursor: true,
          title: languageContent.what_are_weav_events,
        };

        return { Component: ActivityEventsInfo, modalProps };
    }
  }, [type]);

  return (
    <ModalScreen visible={visible} {...modalProps}>
      <Component {...{ setVisible, ...props }} />
    </ModalScreen>
  );
};

export default TutorialModal;
