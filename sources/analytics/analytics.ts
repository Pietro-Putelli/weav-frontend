const isAndroid = Platform.OS === "android";

var analytics;

if (!isAndroid) {
  analytics = require("@react-native-firebase/analytics");
}

import { Platform } from "react-native";
import { Navigation } from "react-native-navigation";

class Analytics {
  private static instance: Analytics | null = null;

  static getInstance() {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  watchScreens = () => {
    if (isAndroid) {
      return;
    }

    Navigation.events().registerComponentDidAppearListener(
      async ({ componentName, componentId }) => {
        if (componentId === "Component") {
          await analytics().logScreenView({
            screen_name: componentName,
            screen_class: componentName,
          });
        }
      }
    );
  };

  sendEvent = async (eventName: string, eventParams?: any) => {
    if (isAndroid) {
      return;
    }

    // await analytics().logEvent(eventName, eventParams);
  };
}

export default Analytics.getInstance();
