import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions } from "react-native";
import { Navigation } from "react-native-navigation";
import SplashScreen from "react-native-splash-screen";
import { useDispatch } from "react-redux";
import { Analytics } from "../analytics";
import { PushNotificationView } from "../components/badgeviews";
import { RootTabContainer } from "../components/containers";
import { SwitchingProfileLoader } from "../components/loaders";
import { eventlisteners, socketactions } from "../constants";
import { SCREENS } from "../constants/screens";
import { changeLocale } from "../dates/localeUtils";
import { setupUserPosition } from "../handlers/user";
import {
  useAppLinkListener,
  useAppState,
  useCurrentBusiness,
  useDelayedEffect,
  useEventActivity,
  useEventListener,
  useIsFocused,
  useLanguages,
  usePushNotifications,
  useShakeEffect,
  useSharedWebSocket,
  useUser,
} from "../hooks";
import { SharePopupModal } from "../modals";
import { pushNavigation, showStackModal } from "../navigation/actions";
import { appendChat } from "../store/slices/chatsReducer";
import {
  incrementMoments,
  incrementRequests,
  incrementSpotReplies,
  setFeeds,
} from "../store/slices/feedsReducer";
import {
  HOME_PADDING_BOTTOM,
  HOME_PADDING_BOTTOM_WITH_EVENT,
} from "../styles/sizes";
import { clearImageCache } from "../utility/functions";
import {
  checkIfGeolocationIsAllowedOnce,
  requestGeolocationPermission,
} from "../utility/permissions";
import BusinessPostsListScreen from "./business-side/BusinessPostsListScreen";
import BusinessProfileScreen from "./business-side/BusinessProfileScreen";
import ChatScreen from "./chat/ChatScreen";
import EventsScreen from "./events/EventsScreen";
import InitialBusinessScreen from "./login/InitialBusinessScreen";
import ProfileScreen from "./profile/ProfileScreen";

const { width } = Dimensions.get("window");

/* Start Analytic Process */

Analytics.watchScreens();

const RootScreen = ({ ...props }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const tabBarRef = useRef();

  const { languageContent } = useLanguages();
  const { hasLocationPermission, doesUserTokenExists } = useUser();

  const [selected, setSelected] = useState(0);

  /* Handle push notifications */
  const [visibleNotification, setVisibleNotification] = useState(false);
  const [notification, setNotification] = useState();

  const [isSwitchingProfile, setIsSwitchingProfile] = useState(false);

  const [isSharePopupVisible, setIsSharePopupVisible] = useState(false);

  const { isBusiness, doesBusinessExist } = useCurrentBusiness();
  const isBusinessLoginVisible = isBusiness && !doesBusinessExist;

  const { hasOngoingEvent } = useEventActivity();

  const screenPaddingBottom = useMemo(() => {
    return HOME_PADDING_BOTTOM;
  }, [hasOngoingEvent]);

  /* Open main websocket connection */

  useSharedWebSocket(
    (data) => {
      const { action, content } = JSON.parse(data);

      if (action == socketactions.ALIGN_USER) {
        const data = JSON.parse(content);

        const profileInfo = data?.profile_info;

        if (profileInfo) {
          dispatch(setFeeds(profileInfo));
        }
      }

      if (action == socketactions.CHAT && isFocused) {
        const chat = content;
        const isChatMuted = chat?.muted;

        const chatUser = chat?.receiver ?? chat?.user;
        const businessOwner = chat?.business;

        dispatch(appendChat(chat));

        const message = chat.messages?.[0];

        if (selected != 3 && !isChatMuted) {
          const notification = {
            chat,
            message,
            user: chatUser,
            event: chat?.event,
            business: businessOwner,
          };

          onShowNotification(notification);
        }
      }

      if (action == socketactions.USER_FRIEND_REQUEST) {
        dispatch(incrementRequests(content.id));
      }

      if (action == socketactions.USER_MENTION_MOMENT) {
        dispatch(incrementMoments(content.id));
      }

      if (action == socketactions.USER_SPOT_REPLIES) {
        dispatch(incrementSpotReplies(content.id));
      }
    },
    [selected, isBusiness, isFocused, incrementSpotReplies]
  );

  /* Request user's position when permissions are denied and settings are opened */
  useAppState(
    ({ isActive }) => {
      if (isBusiness) {
        return;
      }

      if (hasLocationPermission) {
        checkIfGeolocationIsAllowedOnce(() => {
          dispatch(requestGeolocationPermission(getUserPosition));
        });
      }

      if (!hasLocationPermission && isActive) {
        dispatch(requestGeolocationPermission(getUserPosition));
      }
    },
    [hasLocationPermission, isBusiness]
  );

  /* Hide after this delay because of the white flash caused by the light theme */
  useDelayedEffect(50, () => {
    SplashScreen.hide();

    clearImageCache();
  });

  /* Request user's position when open the app */
  useEffect(() => {
    if (isBusiness) {
      return;
    }

    changeLocale(languageContent.locale);

    if (hasLocationPermission) {
      getUserPosition();
    }
  }, [isBusiness]);

  useAppLinkListener(({ event, business }) => {
    const componentId = props.componentId;

    if (isBusiness) {
      return;
    }

    Navigation.dismissAllModals();

    setTimeout(() => {
      if (event) {
        pushNavigation({
          componentId,
          screen: SCREENS.EventDetail,
          passProps: {
            eventId: event,
          },
        });
      } else if (business) {
        pushNavigation({
          componentId,
          screen: SCREENS.VenueDetail,
          passProps: {
            initialBusiness: { id: business },
          },
        });
      }
    }, 100);
  });

  const { onShakeEnd } = useShakeEffect({ isHaptic: true }, () => {
    setIsSharePopupVisible(true);
  });

  const onChangeTab = useCallback((index, options) => {
    const delay = options?.delay ?? 0;

    setTimeout(() => {
      setSelected(index);
      tabBarRef.current?.scrollTo({ x: index * width, animated: false });
    }, delay);
  }, []);

  usePushNotifications({
    onChangeTab,
    componentId: props.componentId,
    permissionsDisabled: isBusinessLoginVisible,
  });

  useEventListener(
    { identifier: eventlisteners.MOVE_TO_HOME },
    ({ tabIndex }) => {
      onChangeTab(tabIndex);
    }
  );

  useEventListener({ identifier: eventlisteners.SWITCHING_PROFILE }, () => {
    setIsSwitchingProfile(true);

    onChangeTab(0, { delay: 200 });

    setTimeout(() => {
      setIsSwitchingProfile(false);
    }, 1000);
  });

  /* Methods */

  const getUserPosition = () => {
    dispatch(setupUserPosition());
  };

  /* Notifications */

  const onShowNotification = (notification) => {
    setNotification(notification);
    setVisibleNotification(true);
  };

  const onPressNotification = () => {
    showStackModal({
      screen: SCREENS.ChatMessage,
      passProps: {
        isModal: true,
        chatId: notification.chat.id,
      },
    });
  };

  if (isBusinessLoginVisible) {
    return <InitialBusinessScreen {...props} />;
  }

  if (!doesUserTokenExists) {
    return null;
  }

  if (isSwitchingProfile) {
    return <SwitchingProfileLoader />;
  }

  const sharedProps = {
    screenPaddingBottom,
    ...props,
  };

  return (
    <>
      <RootTabContainer
        ref={tabBarRef}
        onChangeTab={onChangeTab}
        isFocused={selected == 0}
        states={{ selected, setSelected }}
        {...sharedProps}
      >
        {!isBusiness ? (
          <>
            <EventsScreen
              isFocused={selected == 1}
              onChangeTab={onChangeTab}
              {...sharedProps}
            />

            {/* <BusinessListScreen
              isFocused={selected == 2}
              onChangeTab={onChangeTab}
              {...sharedProps}
            /> */}

            <>{/* Placeholder for moment editor */}</>

            <ChatScreen onChangeTab={onChangeTab} {...sharedProps} />

            <ProfileScreen
              onChangeTab={onChangeTab}
              isFocused={selected == 4}
              {...sharedProps}
            />
          </>
        ) : (
          <>
            <BusinessPostsListScreen {...props} />

            <>{/* Placeholder for event editor */}</>

            <ChatScreen onChangeTab={onChangeTab} {...props} />

            <BusinessProfileScreen {...props} />
          </>
        )}
      </RootTabContainer>

      {notification && (
        <PushNotificationView
          notification={notification}
          states={{
            visible: visibleNotification,
            setVisible: setVisibleNotification,
          }}
          onPress={onPressNotification}
        />
      )}

      {!isBusiness && (
        <SharePopupModal
          onDismiss={onShakeEnd}
          visible={isSharePopupVisible}
          setVisible={setIsSharePopupVisible}
        />
      )}
    </>
  );
};

export default RootScreen;
