import "react-native-gesture-handler";

import "./sources/utility/prototypes";

import { LogBox } from "react-native";
import { Navigation } from "react-native-navigation";
import { SCREEN_COMPONENTS } from "./sources/constants/screen-components";
import { SCREENS } from "./sources/constants/screens";
import { getIsUserLogged } from "./sources/handlers/user";
import { InitialScreen } from "./sources/screens";
import RootScreen from "./sources/screens/RootScreen";
import {
  InitialScreenWrapper,
  RootScreenWrapper,
  ScreenWrapper,
} from "./sources/wrappers";

/* Register all screens */

Navigation.events().registerAppLaunchedListener(async () => {
  SCREEN_COMPONENTS.TABS.forEach(({ name, component }) => {
    Navigation.registerComponent(name, () => ScreenWrapper(component));
  });

  const isUserLogged = getIsUserLogged();

  Navigation.registerComponent(SCREENS.Initial, () => {
    return InitialScreenWrapper(InitialScreen);
  });

  SCREEN_COMPONENTS.LOGIN.forEach(({ name, component }) => {
    Navigation.registerComponent(name, () => ScreenWrapper(component));
  });

  SCREEN_COMPONENTS.STACK.forEach(({ name, component }) => {
    Navigation.registerComponent(name, () => ScreenWrapper(component));
  });

  SCREEN_COMPONENTS.MODALS.forEach(({ name, component }) => {
    Navigation.registerComponent(name, () => ScreenWrapper(component));
  });

  Navigation.registerComponent(SCREENS.Root, () =>
    RootScreenWrapper(RootScreen)
  );

  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: isUserLogged ? SCREENS.Root : SCREENS.Initial,
            },
          },
        ],
      },
    },
  });
});

Navigation.setDefaultOptions({
  topBar: { visible: false },
  statusBar: {
    style: "dark",
  },
  layout: {
    orientation: ["portrait"],
    backgroundColor: "#090616",
    componentBackgroundColor: "#090616",
  },
  animations: {
    setRoot: {
      alpha: { from: 0, to: 1, duration: 300 },
    },
  },
});

LogBox.ignoreLogs([
  "VirtualizedLists should",
  "Deprecation warning",
  "FlashList will ignore horizontal padding in case of vertical lists and vertical padding if the list is horizontal. If you need to have it apply relevant padding to your items instead.",
  "Please report: Excessive number of pending callbacks: 501.",
  "No native splash",
  "Failed to call into",
  "Failed prop type: Hyperlink",
  "flexWrap",
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
  "FlashList's",
  "new NativeEventEmitter",
  "Error: Nothing to dismiss",
  "Warning: Overriding previous layout animation with new one before the first began",
  "Looks like you're trying to use RecyclerListView's layout animation render while doing pagination.",
  "Looks like you're trying to use RecyclerListView's layout animation render while doing pagination. This operation will be ignored to avoid creation of too many items due to developer error.",
  "Selector",
  "Constants.platform",
]);
