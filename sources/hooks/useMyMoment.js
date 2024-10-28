import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyMoments } from "../backend/moments";
import {
  getMyMomentsLoadedState,
  getMyMomentsState,
  setMyMomentsState,
} from "../store/slices/momentsReducer";
import { count } from "../utility/collections";

const useMyMoment = () => {
  const moments = useSelector(getMyMomentsState);
  const areMyMomentsLoaded = useSelector(getMyMomentsLoadedState);

  const momentsEmpty = isEmpty(moments);
  const momentsCount = count(moments);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (momentsEmpty || !areMyMomentsLoaded) {
      fetchMoments({ mode: "set-initial" });
    }
  }, []);

  const fetchMoments = ({ mode, offset = 0 }) => {
    setIsLoading(true);
    setIsNotFound(false);

    getMyMoments({ offset }, (moments) => {
      if (moments) {
        setIsLoading(false);
        setIsNotFound(isEmpty(moments));

        dispatch(setMyMomentsState({ moments, mode }));
      }
    });
  };

  const refreshMoments = () => {
    setIsRefreshing(true);

    getMyMoments({ offset: 0 }, (moments) => {
      if (moments) {
        setIsRefreshing(false);
        setIsNotFound(isEmpty(moments));

        dispatch(setMyMomentsState({ moments }));
      }
    });
  };

  return {
    moments,
    momentsCount,
    momentsEmpty,
    fetchMoments,
    refreshMoments,
    isLoading,
    isRefreshing,
    isNotFound,
    setIsNotFound,
  };
};

export default useMyMoment;
