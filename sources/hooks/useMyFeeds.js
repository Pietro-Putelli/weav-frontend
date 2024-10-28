import { useDispatch, useSelector } from "react-redux";
import {
  getFeedsCount,
  getFeedsTotalUnreadCount,
  getFeedsUnreadCount,
  readSpotRepliesState,
} from "../store/slices/feedsReducer";

const useMyFeeds = () => {
  const unreadFeedProfile = useSelector(getFeedsUnreadCount);
  const feedsCountTotal = useSelector(getFeedsTotalUnreadCount);

  const { momentsCount, requestsCount } = useSelector(getFeedsCount);

  const { myEventsCount } = useSelector(getFeedsCount);

  const dispatch = useDispatch();

  const readRepliesCount = () => {
    dispatch(readSpotRepliesState());
  };

  return {
    feedsCountTotal,
    unreadFeedProfile,
    myEventsCount,

    momentsCount,
    requestsCount,

    readRepliesCount,
  };
};

export default useMyFeeds;
