import React, { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { openSettings } from "react-native-permissions";
import Animated, { FadeOutDown } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import {
  useAppState,
  useCurrentBusiness,
  useLanguages,
  useSettings,
} from "../../hooks";
import { requestDeviceToken } from "../../hooks/usePushNotifications";
import {
  getPermissionsGranted,
  setPermissionsGranted,
} from "../../store/slices/userReducer";
import { icons } from "../../styles";
import {
  checkNotificationsPermission,
  requesPushtNotificationPermissions,
} from "../../utility/permissions";
import { SolidButton } from "../buttons";
import { CheckableCell } from "../cells";
import { MainScrollView } from "../containers";
import { MainText } from "../texts";

const Notifications = () => {
  const { isBusiness } = useCurrentBusiness();
  const { languageContent } = useLanguages();

  const { settings, changeNotifications } = useSettings();
  const { notifications: hasPermissions } = useSelector(getPermissionsGranted);

  const notifications = settings.notifications;
  const disabledAll = notifications?.all;

  const dispatch = useDispatch();

  /* Effects */

  useAppState(({ isActive }) => {
    if (!hasPermissions && isActive) {
      checkNotificationsPermission(({ isGranted }) => {
        if (isGranted) {
          dispatch(requestDeviceToken());
        }
      });
    }
  }, []);

  /* Props */

  const notificationsContent = useMemo(() => {
    const notifications = languageContent.notifications;

    if (isBusiness) {
      return notifications.business;
    }
    return notifications.user;
  }, []);

  /* Callbacks */

  const onEnableNotificationPress = () => {
    checkNotificationsPermission(({ status }) => {
      if (status == "denied") {
        requesPushtNotificationPermissions((isGranted) => {
          dispatch(setPermissionsGranted({ notifications: isGranted }));

          if (isGranted) {
            dispatch(requestDeviceToken());
          }
        });
      } else {
        openSettings();
      }
    });
  };

  const onPress = useCallback(
    ({ type }) => {
      const value = !Boolean(notifications?.[type]);
      changeNotifications({ [type]: value });
    },
    [settings]
  );

  return (
    <MainScrollView title={languageContent.notification}>
      {!hasPermissions && (
        <Animated.View exiting={FadeOutDown} style={styles.permissionHeader}>
          <MainText style={styles.title} font="subtitle-1">
            {languageContent.please_enable_notifications}
          </MainText>

          <SolidButton
            type="done"
            title={languageContent.buttons.enable_notifications}
            icon={icons.NotificationOn}
            onPress={onEnableNotificationPress}
          />
        </Animated.View>
      )}

      {notificationsContent.map((notification, index) => {
        const selected = Boolean(notifications?.[notification.type]);
        const disabled = (disabledAll && index != 0) || !hasPermissions;

        return (
          <CheckableCell
            key={index}
            noMarginTop={index == 0}
            onPress={() => {
              onPress(notification);
            }}
            selected={selected}
            item={notification}
            disabled={disabled}
          />
        );
      })}
    </MainScrollView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  permissionHeader: {
    marginBottom: "6%",
  },
  title: {
    marginHorizontal: "2%",
    marginBottom: "4%",
  },
});
