import { Platform } from "react-native";

export const getDeviceType = () => {
  return String(Platform.OS).toUpperCase();
};
