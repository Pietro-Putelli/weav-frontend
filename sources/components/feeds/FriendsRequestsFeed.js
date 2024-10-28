import { unionBy } from "lodash";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { useDispatch } from "react-redux";
import { eventlisteners, querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useFriends, useLanguages } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { decrementRequests } from "../../store/slices/feedsReducer";
import { NAVIGATION_BAR_HEIGHT, TAB_BAR_HEIGHT } from "../../styles/sizes";
import { triggerHapticOnce } from "../../utility/haptics";
import { AdvancedFlatList } from "../lists";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";
import FriendRequestCell from "./FriendRequestCell";

const FriendsRequestsFeed = ({ scrollY, componentId }) => {
  const [requests, setRequests] = useState([]);

  const {
    fetchFriendRequests,
    acceptFriendRequest,
    refuseFriendRequest,
    isLoading,
    isNotFound,
  } = useFriends();

  const { languageContent } = useLanguages();
  const dispatch = useDispatch();

  const offset = useRef(0);

  /* Effects */

  useEffect(() => {
    getFriendRequests();
  }, []);

  /* Methods */

  const getFriendRequests = () => {
    fetchFriendRequests(offset.current, (data) => {
      setRequests((requests) => {
        return unionBy(requests, data, "id");
      });
    });
  };

  const removeRequest = (id) => {
    const filtered = requests.filter((request) => {
      return request.id != id;
    });

    triggerHapticOnce();
    setRequests(filtered);

    EventRegister.emit(eventlisteners.FRIEND_REQUESTS_LAYOUT);
  };

  /* Callbacks */
  const onUserPress = useCallback((user) => {
    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user },
    });
  }, []);

  const onEndReached = useCallback(() => {
    offset.current += querylimits.TEN;

    getFriendRequests();
  }, []);

  /* Accept or Refuse friend request */
  const onActionPress = useCallback(
    ({ id, userId }) => {
      if (userId) {
        acceptFriendRequest(userId, () => {
          removeRequest(id);

          dispatch(decrementRequests(id));
        });
      } else {
        refuseFriendRequest(id, () => {
          removeRequest(id);

          dispatch(decrementRequests(id));
        });
      }
    },
    [requests]
  );

  /* Components */

  const renderItem = useCallback(
    ({ item: request }) => {
      return (
        <FriendRequestCell
          request={request}
          onPress={onUserPress}
          onActionPress={onActionPress}
        />
      );
    },
    [onUserPress, onActionPress]
  );

  const ListHeaderComponent = useMemo(() => {
    return (
      <SeparatorTitle marginLeft>
        {languageContent.separator_titles.friend_requests}
      </SeparatorTitle>
    );
  }, []);

  const ListEmptyComponent = useMemo(() => {
    if (isNotFound) {
      return (
        <View style={{ alignItems: "center", marginTop: "4%" }}>
          <MainText font="subtitle">
            {languageContent.placeholders.no_friend_requests_yet}
          </MainText>
        </View>
      );
    }
  }, [isNotFound]);

  return (
    <AdvancedFlatList
      data={requests}
      enabledAnimation
      scrollY={scrollY}
      isLoading={isLoading}
      estimatedItemSize={100}
      renderItem={renderItem}
      onEndReached={onEndReached}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={{
        paddingTop: NAVIGATION_BAR_HEIGHT,
        paddingBottom: TAB_BAR_HEIGHT,
      }}
      layoutAnimationIdentifier={eventlisteners.FRIEND_REQUESTS_LAYOUT}
    />
  );
};

export default memo(FriendsRequestsFeed);
