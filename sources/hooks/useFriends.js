import { isEmpty } from "lodash";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteFriendRequest,
  getFriendRequests,
  getUserFriends,
  requestFriendship,
} from "../backend/profile";
import { updateFriendState } from "../store/slices/profilesReducer";

export const FRIEND_STATES = {
  LOADING: "loading",
  NONE: "none",
  MY_REQUEST: "my-request",
  USER_REQUEST: "user-request",
  FRIEND: "friend",
};

const { LOADING, NONE, MY_REQUEST, USER_REQUEST, FRIEND } = FRIEND_STATES;

const useFriends = ({ profile } = {}) => {
  const dispatch = useDispatch();

  const userId = profile?.id;
  const friendState = profile?.friend_state ?? LOADING;

  /* Utiliy States */
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  /* Methods */

  const _updateFriendState = () => {
    let newFriendState = friendState;

    if (newFriendState == NONE) {
      newFriendState = MY_REQUEST;
    } else if (newFriendState == USER_REQUEST) {
      newFriendState = FRIEND;
    } else {
      newFriendState = NONE;
    }

    dispatch(updateFriendState({ userId, friendState: newFriendState }));
  };

  const requestFriend = () => {
    _updateFriendState();

    requestFriendship(userId, () => {});
  };

  const endLoading = (data) => {
    setIsNotFound(isEmpty(data));
    setIsLoading(false);
  };

  const fetchMyFriends = (offset, callback) => {
    setIsLoading(true);

    getUserFriends({ offset }, ({ friends, count }) => {
      endLoading(friends);
      callback({ friends, count });
    });
  };

  const fetchFriendRequests = (offset, callback) => {
    setIsLoading(true);

    getFriendRequests(offset, (data) => {
      endLoading(data);

      callback(data);
    });
  };

  const acceptFriendRequest = (userId, callback) => {
    requestFriendship(userId, (isDone) => {
      if (isDone) {
        callback();
      }
    });
  };

  const refuseFriendRequest = (requestId, callback) => {
    deleteFriendRequest(requestId, (isDone) => {
      if (isDone) {
        callback();
      }
    });
  };

  return {
    friendState,
    requestFriend,
    fetchMyFriends,
    fetchFriendRequests,
    acceptFriendRequest,
    refuseFriendRequest,
    isLoading,
    isNotFound,
  };
};

export default useFriends;
