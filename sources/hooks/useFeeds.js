import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyFeeds } from "../backend/profile";
import {
  getMyFeedMomentsState,
  setMyFeedMomentsState,
} from "../store/slices/momentsReducer";

const useFeeds = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const dispatch = useDispatch();

  const feeds = useSelector(getMyFeedMomentsState);
  const isFeedsEmpty = isEmpty(feeds);

  /* Effects */

  useEffect(() => {
    if (isFeedsEmpty) {
      fetchFeeds();
    }
  }, []);

  const fetchFeeds = (offset = 0) => {
    const mode = offset == 0 ? "set" : "append";

    setIsLoading(true);

    getMyFeeds({ offset }, (moments) => {
      setIsLoading(false);
      setIsRefreshing(false);

      if (moments) {
        setIsNotFound(isEmpty(moments));

        dispatch(setMyFeedMomentsState({ moments, mode }));
      }
    });
  };

  const refreshFeeds = () => {
    setIsRefreshing(true);

    fetchFeeds();
  };

  return {
    feeds,

    isLoading,
    isRefreshing,
    isNotFound,

    fetchFeeds,
    refreshFeeds,
  };
};

export default useFeeds;
