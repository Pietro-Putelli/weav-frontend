import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserMoments, getUserMomentsById } from "../backend/moments";
import { getMomentsState } from "../store/slices/momentsReducer";
import useCurrentLocation from "./useCurrentLocation";

const useUserMoments = ({ userId } = {}) => {
  const moments = useSelector(getMomentsState);
  const isEmptyMoments = isEmpty(moments);

  const cachedMoments = []; //useSelector(getCachedUserMoments);
  const isCacheEmpty = isEmpty(cachedMoments);

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const [isCaching, setIsCaching] = useState(false);

  /* To track the position changing */
  const [isChanging, setIsChanging] = useState(true);

  /* Handle profile mode */

  if (userId) {
    const [moments, setMoments] = useState([]);

    useEffect(() => {
      fetchMoments();
    }, []);

    const fetchMoments = () => {
      setIsLoading(true);

      getUserMomentsById(userId, (data) => {
        if (data) {
          setMoments(data);
        }

        setIsLoading(false);
      });
    };

    return {
      moments,
      isLoading,
    };
  }

  /* Handle all moments nearby */

  useEffect(() => {
    if (!isCaching || isCacheEmpty) {
      setIsNotFound(isEmptyMoments);
    }
  }, [isEmptyMoments, isCaching]);

  useCurrentLocation(() => {
    setIsChanging(true);

    fetchMoments({ offset: 0 });
  }, []);

  const endLoading = (succ) => {
    setIsLoading(false);
    setIsRefreshing(false);

    if (succ) {
      setIsCaching(false);

      setTimeout(() => {
        setIsChanging(false);
      }, 500);
    } else {
      setIsCaching(true);
    }
  };

  const fetchMoments = (options) => {
    setIsLoading(true);

    dispatch(getUserMoments(options, endLoading));
  };

  const refreshMoments = () => {
    setIsRefreshing(true);
    fetchMoments({ offset: 0 }, endLoading);
  };

  return {
    moments: isCaching ? cachedMoments : moments,
    fetchMoments,
    refreshMoments,

    isNotFound,
    isLoading,
    isRefreshing,
    isChanging: isChanging && !isCaching,
    isCaching,
  };
};

export default useUserMoments;
