import { useEffect } from "react";
import { Notifications } from "react-native-notifications";
import { useDispatch, useSelector } from "react-redux";
import { updateDeviceToken } from "../backend/devices";
import { actiontypes } from "../constants";
import { SCREENS } from "../constants/screens";
import {
  pushNavigation,
  safeDismissAllModals,
  safePopToRoot,
  showNotificationPermissionModal,
} from "../navigation/actions";
import {
  getDeviceToken,
  getPermissionsGranted,
  setPermissionsGranted,
} from "../store/slices/userReducer";
import { isNullOrUndefined } from "../utility/boolean";
import {
  checkNotificationsPermission,
  requesPushtNotificationPermissions,
} from "../utility/permissions";
import useCurrentBusiness from "./useCurrentBusiness";

const usePushNotifications = (
  { componentId, onChangeTab, permissionsDisabled },
  dependencies = []
) => {
  const dispatch = useDispatch();

  const permissions = useSelector(getPermissionsGranted);
  const hasNotificationsPermission = permissions.notifications;

  const { value: deviceToken, isSent: isTokenAlreadyUploaded } =
    useSelector(getDeviceToken);

  const hasDeviceToken = !isNullOrUndefined(deviceToken);

  const { isBusiness } = useCurrentBusiness();

  useEffect(() => {
    if (permissionsDisabled) {
      return;
    }

    if (hasNotificationsPermission) {
      if (!hasDeviceToken) {
        Notifications.registerRemoteNotifications();
      } else if (!isTokenAlreadyUploaded) {
        dispatch(updateDeviceToken(deviceToken));
      }
      return;
    }

    dispatch(
      requestNotificationPermission({
        permissionsAlreadyGranted: permissions.notification,
        componentId,
      })
    );
  }, [permissionsDisabled, ...dependencies]);

  /* Handle received token */

  useEffect(() => {
    Notifications.events().registerRemoteNotificationsRegistered(
      ({ deviceToken }) => {
        console.log("=>", deviceToken);
        dispatch(updateDeviceToken(deviceToken));
      }
    );

    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      (event) => {
        console.error(event);
      }
    );
  }, []);

  const handleReceivedNotification = (notification, completion) => {
    const payload = notification?.payload;

    if (!payload) {
      return;
    }

    const { user, event_id, chat, moment_id, spot_id, weekly_updates } =
      payload;

    safeDismissAllModals();
    safePopToRoot(componentId);

    if (user) {
      pushNavigation({
        componentId,
        screen: SCREENS.Profile,
        passProps: { user },
      });
    } else if (chat) {
      onChangeTab?.(3);
      // const chatType = getChatType(chat);
      // const isUserSender = isNullOrUndefined(chat?.business);

      // if (chatType == CHAT_TYPES.BUSINESS && isUserSender && !isBusiness) {
      //   return;
      // }

      // pushNavigation({
      //   componentId,
      //   screen: SCREENS.ChatMessage,
      //   passProps: { chatData: chat },
      // });
    } else if (moment_id) {
      pushNavigation({
        componentId,
        screen: !isBusiness ? SCREENS.UserFeed : SCREENS.MomentsList,
        passProps: { type: actiontypes.USER_MOMENTS_SCREEN.TAGS },
      });
    } else if (event_id) {
      pushNavigation({
        componentId,
        screen: SCREENS.EventDetail,
        passProps: { eventId: event_id },
      });
    } else if (spot_id) {
      pushNavigation({
        componentId,
        screen: SCREENS.MyMoments,
      });
    } else if (weekly_updates) {
      onChangeTab?.(1);
    }

    completion?.();
  };

  /* Dispatch notifications */

  useEffect(() => {
    if (!componentId) {
      return;
    }

    Notifications.events().registerNotificationOpened(
      handleReceivedNotification
    );

    /* Handle notifications when the app is closed */

    Notifications.getInitialNotification()
      .then(handleReceivedNotification)
      .catch((err) => {
        console.error("[get-initial-notification]", err);
      });
  }, [isBusiness]);
};

export default usePushNotifications;

/* Utility functions */

export const requestDeviceToken = () => (dispatch) => {
  dispatch(setPermissionsGranted({ notifications: true }));

  Notifications.registerRemoteNotifications();
};

export const requestNotificationPermission =
  ({ componentId, permissionsAlreadyGranted, isDirect }) =>
  (dispatch) => {
    checkNotificationsPermission(({ status, isGranted }) => {
      if (isGranted) {
        Notifications.registerRemoteNotifications();

        dispatch(setPermissionsGranted({ notifications: true }));
      } else {
        if (componentId && !permissionsAlreadyGranted) {
          showNotificationPermissionModal(status);
          return;
        }

        if (isDirect) {
          requesPushtNotificationPermissions((isGranted) => {
            dispatch(setPermissionsGranted({ notifications: isGranted }));

            if (isGranted) {
              Notifications.registerRemoteNotifications();
            }
          });
          return;
        }
      }
    });
  };
