import StaticSafeAreaInsets from "react-native-static-safe-area-insets";
import { isAndroidDevice } from "../utility/functions";

const isAndrod = isAndroidDevice();

const safeAreaInsetsTop = StaticSafeAreaInsets.safeAreaInsetsTop;
const safeAreaInsetsBottom = StaticSafeAreaInsets.safeAreaInsetsBottom;

const insets = {
  top: isAndrod ? 16 : Math.max(safeAreaInsetsTop, 24),
  bottom: isAndrod ? 16 : Math.max(safeAreaInsetsBottom, 8),

  topAndroid: isAndrod ? 0 : safeAreaInsetsTop,
  bottomAndroid: isAndrod ? 0 : safeAreaInsetsBottom,

  vertical: 8,
};

export default insets;
