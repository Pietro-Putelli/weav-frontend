import { Dimensions } from "react-native";
import {
  Navigation,
  OptionsModalPresentationStyle,
  OptionsModalTransitionStyle,
} from "react-native-navigation";
import { actiontypes } from "../constants";
import { SCREENS } from "../constants/screens";
import { getTutorialSettings } from "../store/store";
import { isAndroidDevice } from "../utility/functions";

const { width } = Dimensions.get("window");

const isAndroid = isAndroidDevice();

const androidAnimations = {
  push: {
    content: {
      translationX: {
        from: width,
        to: 0,
        duration: 250,
        interpolation: {
          type: "decelerate",
        },
      },
    },
  },

  pop: {
    content: {
      translationX: {
        from: 0,
        to: width,
        duration: 250,
        interpolation: {
          type: "accelerate",
        },
      },
    },
  },
};

export const pushNavigation = ({ componentId, screen, options, ...props }) => {
  Navigation.push(componentId, {
    component: {
      name: screen,
      options: {
        layout: {
          componentBackgroundColor: "#090616",
        },
        animations: isAndroid ? androidAnimations : {},
        ...options,
      },
      ...props,
    },
  });
};

export const showModalNavigation = ({
  screen,
  fullscreen = false,
  options,
  ...props
}) => {
  Navigation.showModal({
    component: {
      name: screen,
      options: {
        modalPresentationStyle: fullscreen ? "fullScreen" : "pageSheet",
        layout: {
          componentBackgroundColor: "#090616",
        },
        popGesture: false,
      },
      ...props,
    },
  });
};

export const showSheetNavigation = ({ screen, isStack, ...props }) => {
  const stackOptions = {
    stack: {
      options: {
        layout: {
          componentBackgroundColor: "transparent",
          backgroundColor: "transparent",
        },
      },
      children: [
        {
          component: {
            name: screen,
            options: {
              modalPresentationStyle: "overCurrentContext",
              modalTransitionStyle: "crossDissolve",
              layout: {
                componentBackgroundColor: "transparent",
              },
            },
            ...props,
          },
        },
      ],
    },
  };

  const sheetOptions = {
    component: {
      name: screen,
      options: {
        modalPresentationStyle: "overCurrentContext",
        modalTransitionStyle: "crossDissolve",
        layout: {
          componentBackgroundColor: "transparent",
        },
      },
      ...props,
    },
  };

  const options = isStack ? stackOptions : sheetOptions;

  Navigation.showModal(options);
};

export const showStackModal = ({
  screen,
  fullscreen,
  isTransparent,
  ...props
}) => {
  let options, stackOptions;

  if (isTransparent) {
    options = {
      modalPresentationStyle: OptionsModalPresentationStyle.overCurrentContext,
      modalTransitionStyle: OptionsModalTransitionStyle.crossDissolve,
      layout: {
        componentBackgroundColor: "transparent",
      },
    };

    stackOptions = {
      layout: {
        componentBackgroundColor: "transparent",
        backgroundColor: "transparent",
      },
    };
  }

  Navigation.showModal({
    stack: {
      options: stackOptions,
      children: [
        {
          component: {
            name: screen,
            options: {
              modalPresentationStyle:
                fullscreen == undefined || fullscreen
                  ? "fullScreen"
                  : "pageSheet",
              layout: {
                componentBackgroundColor: "#090616",
              },
              ...props?.options,
              ...options,
            },
            ...props,
          },
        },
      ],
    },
  });
};

export const showCrossFadeStackModal = ({ screen, ...props }) => {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: screen,
            ...props,
          },
        },
      ],
      options: {
        modalPresentationStyle: "overCurrentContext",
        modalTransitionStyle: "crossDissolve",
        layout: {
          componentBackgroundColor: "transparent",
        },
      },
    },
  });
};

export const showCrossFadeModal = ({ screen, ...props }) => {
  Navigation.showModal({
    component: {
      name: screen,
      options: {
        modalPresentationStyle: "overCurrentContext",
        modalTransitionStyle: "crossDissolve",
        layout: {
          componentBackgroundColor: "transparent",
        },
      },
      ...props,
    },
  });
};

/* Used in Registration, Login and Login With */

export const setRootScreen = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: SCREENS.Root,
              options: {
                popGesture: false,
              },
            },
          },
        ],
      },
    },
  });
};

export const navigateToFirstScreen = (callback) => {
  Navigation.setRoot({
    root: {
      stack: { children: [{ component: { name: SCREENS.Initial } }] },
    },
  }).then(callback);
};

export const safeDismissAllModals = () => {
  Navigation.dismissAllModals()
    .then(() => {})
    .catch(() => {});
};

export const safeDismissModal = () => {
  Navigation.dismissModal()
    .then(() => {})
    .catch(() => {});
};

export const safePopToRoot = (componentId) => {
  Navigation.popToRoot(componentId)
    .then(() => {})
    .catch(() => {});
};

/* Use to show modal for showing notification permission modal, 1 / 10 the user open the app */
export const showNotificationPermissionModal = (status) => {
  const random = Math.floor(Math.random() * 10) + 1;

  setTimeout(() => {
    /* This is the first time the user logged-in */
    if (status == "denied" || random === 1) {
      showSheetNavigation({
        screen: SCREENS.Tutorial,
        passProps: {
          type: actiontypes.TUTORIAL.NOTIFICATIONS,
        },
      });
    }
  }, 10_000);
};
