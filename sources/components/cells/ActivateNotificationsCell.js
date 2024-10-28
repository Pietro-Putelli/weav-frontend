import React, { useCallback, useRef } from "react";
import { FadeAnimatedView } from "../animations";
import { SquareImage } from "../images";
import { useAppState, useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { StyleSheet } from "react-native";
import { MainText } from "../texts";
import { SolidButton } from "../buttons";
import { widthPercentage } from "../../styles/sizes";
import { useDispatch, useSelector } from "react-redux";
import {
  requestDeviceToken,
  requestNotificationPermission,
} from "../../hooks/usePushNotifications";
import {
  getPermissionsGranted,
  setPermissionsGranted,
} from "../../store/slices/userReducer";
import { requesPushtNotificationPermissions } from "../../utility/permissions";
import { checkNotifications, openSettings } from "react-native-permissions";

const ICON_SIDE = widthPercentage(0.1);

const ActivateNotificationsCell = () => {
  const { languageContent } = useLanguages();

  const theme = useTheme();
  const dispatch = useDispatch();
  const didOpenSettings = useRef(false);

  const { notifications: hasNotificationsPermission } = useSelector(
    getPermissionsGranted
  );

  /* Effects */

  useAppState(({ isActive }) => {
    if (
      hasNotificationsPermission == false &&
      isActive &&
      didOpenSettings.current
    ) {
      checkNotifications().then(({ status }) => {
        if (status === "granted") {
          dispatch(setPermissionsGranted({ notifications: true }));

          onPermissionGranted();
        }
      });
    }
  }, []);

  const onPermissionGranted = () => {
    dispatch(requestDeviceToken());
  };

  const onPress = useCallback(() => {
    requesPushtNotificationPermissions((isGranted) => {
      dispatch(setPermissionsGranted({ notifications: isGranted }));

      if (isGranted) {
        onPermissionGranted();
      }

      if (hasNotificationsPermission == false) {
        didOpenSettings.current = true;
        openSettings();
      }
    });
  }, [hasNotificationsPermission]);

  return (
    <FadeAnimatedView style={[styles.container, theme.styles.shadow_round]}>
      <SquareImage
        side={ICON_SIDE}
        source={icons.ColoredNotifications}
        coloredIcon
      />
      <MainText style={styles.text} font="subtitle-2">
        {languageContent.switch_on_notifications}
      </MainText>

      <SolidButton onPress={onPress} type="done" title="enable" />
    </FadeAnimatedView>
  );
};

export default ActivateNotificationsCell;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 8,
    marginBottom: "5%",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    flex: 1,
    marginHorizontal: 12,
  },
});
