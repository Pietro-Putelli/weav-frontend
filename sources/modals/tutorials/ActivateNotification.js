import React, { memo, useCallback, useRef } from "react";
import { View } from "react-native";
import { checkNotifications, openSettings } from "react-native-permissions";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, SolidButton } from "../../components/buttons";
import { SquareImage } from "../../components/images";
import { MainText } from "../../components/texts";
import { useAppState, useLanguages } from "../../hooks";
import { requestDeviceToken } from "../../hooks/usePushNotifications";
import {
  getPermissionsGranted,
  setPermissionsGranted,
} from "../../store/slices/userReducer";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { triggerHaptic } from "../../utility/haptics";
import { requesPushtNotificationPermissions } from "../../utility/permissions";

const ActivateNotification = ({ setVisible }) => {
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const { notifications: hasNotificationsPermission } = useSelector(
    getPermissionsGranted
  );

  const didOpenSettings = useRef(false);

  /* Once the user go back from settings, check if he has activate notifications */
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
        } else {
          setVisible(false);
        }
      });
    }
  }, []);

  const onPermissionGranted = () => {
    dispatch(requestDeviceToken());

    triggerHaptic();
    setVisible(false);
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
    <View style={{ marginTop: "10%" }}>
      <View style={{ alignItems: "center" }}>
        <SquareImage
          coloredIcon
          side={widthPercentage(0.2)}
          source={icons.ColoredNotifications}
        />
      </View>

      <View style={{ marginTop: "6%", marginHorizontal: "4%" }}>
        <MainText font="subtitle" align="center">
          {languageContent.notification_modal}
        </MainText>
      </View>

      <View style={{ position: "absolute", top: -20, right: 4 }}>
        <IconButton
          onPress={() => {
            setVisible(false);
          }}
          source={icons.Cross}
          side={24}
          inset={2}
        />
      </View>

      <View style={{ marginTop: "6%" }}>
        <SolidButton
          type="done"
          title={languageContent.yes_activate}
          onPress={onPress}
        />
      </View>
    </View>
  );
};

export default memo(ActivateNotification);
