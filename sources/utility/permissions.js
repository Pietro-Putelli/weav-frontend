import { PermissionsAndroid, Platform } from "react-native";
import {
  PERMISSIONS,
  RESULTS,
  check,
  checkNotifications,
  openSettings,
  request,
  requestNotifications,
} from "react-native-permissions";
import { Camera } from "react-native-vision-camera";
import { setPermissionsGranted } from "../store/slices/userReducer";
import { isAndroidDevice } from "./functions";

const isAndroid = isAndroidDevice();

export const requestGeolocationPermission = (callback) => (dispatch) => {
  if (Platform.OS === "ios") {
    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((status) => {
      dispatch(setPermissionsGranted({ location: status == "granted" }));
      callback?.();
    });
  } else {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((status) => {
      const isGranted = status == "granted";
      if (isGranted) {
        dispatch(setPermissionsGranted({ location: true }));
        callback?.();
      }
    });
  }
};

export const checkIfGeolocationIsAllowedOnce = (callback) => {
  check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((status) => {
    if (status == RESULTS.DENIED || status == RESULTS.UNAVAILABLE) {
      callback();
    }
  });
};

export const requestMediaLibraryPermission = (callback) => (dispatch) => {
  const errorCallback = (error) => {
    console.error(error);
  };

  const successCallback = (status) => {
    if (status == "granted" || status == "limited") {
      callback?.();
    } else {
      openSettings();
    }

    dispatch(setPermissionsGranted({ media: status == "granted" }));
  };

  if (isAndroid) {
    const version = Platform.constants.Release;

    const permissionKey =
      version >= 13 ? "READ_MEDIA_IMAGES" : "READ_EXTERNAL_STORAGE";

    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS[permissionKey])
      .then(successCallback)
      .catch(errorCallback);
  } else {
    request(PERMISSIONS.IOS.PHOTO_LIBRARY)
      .then(successCallback)
      .catch(errorCallback);
  }
};

export const requestCameraPermission = () => (dispatch) => {
  Camera.requestCameraPermission().then((status) => {
    const isAuthorized = status == "authorized";

    if (!isAuthorized) {
      openSettings();
    }

    dispatch(setPermissionsGranted({ camera: isAuthorized }));
  });
};

const requestMicrophonePermission = () => (dispatch) => {
  Camera.requestMicrophonePermission().then((status) => {
    const isAuthorized = status == "authorized";

    if (!isAuthorized) {
      openSettings();
    }

    dispatch(setPermissionsGranted({ mic: isAuthorized }));
  });
};

export const requestPermissionForType = (type) => (dispatch) => {
  switch (type) {
    case "camera":
      dispatch(requestCameraPermission());
      break;
    case "mic":
      dispatch(requestMicrophonePermission());
      break;
    case "media":
      dispatch(requestMediaLibraryPermission());
      break;
    case "location":
      dispatch(requestGeolocationPermission());
      break;
  }
};

export const requesPushtNotificationPermissions = (callback) => {
  requestNotifications(["alert", "sound"]).then(({ status }) => {
    const isGranted = status == "granted";
    callback(isGranted);
  });
};

export const checkNotificationsPermission = (callback) => {
  checkNotifications().then(({ status }) => {
    callback({ isGranted: status == "granted", status });
  });
};

export const checkPhotoLibraryPermission = (callback) => {
  const permission = isAndroid
    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.PHOTO_LIBRARY;

  check(permission).then((status) => {
    const isLimited = status === "limited";
    const isGranted = status === "granted";

    callback({ isLimited, isGranted });
  });
};
