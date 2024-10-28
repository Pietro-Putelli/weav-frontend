import { isEmpty, unionBy } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpotsAPI from "../backend/spots";
import { getMySpotsState } from "../store/slices/spotsReducer";

export const SPOTS_MODE = {
  MINE: "MINE",
  REPLIES: "REPLIES",
};

const useSpots = ({ businessId, spotId, mode } = {}) => {
  /* States */

  const [spots, setSpots] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const sharedProps = useMemo(() => {
    return { isLoading, isRefreshing, isNotFound };
  }, [isLoading, isRefreshing, isNotFound]);

  const dispatch = useDispatch();

  const isMounted = useRef(false);

  let fetchSpots;

  const endLoading = (data) => {
    setIsLoading(false);
    setIsRefreshing(false);

    setIsNotFound(isEmpty(data));
  };

  if (mode === SPOTS_MODE.MINE) {
    const spots = useSelector(getMySpotsState);

    useEffect(() => {
      fetchSpots();
    }, []);

    useEffect(() => {
      if (isMounted.current && isEmpty(spots) && !isNotFound) {
        setIsNotFound(true);
      }
    }, [spots]);

    fetchSpots = () => {
      setIsLoading(true);

      dispatch(
        SpotsAPI.getMine((data) => {
          endLoading(data);

          isMounted.current = true;
        })
      );
    };

    return { spots, fetchSpots, ...sharedProps };
  }

  if (mode === SPOTS_MODE.REPLIES) {
    const [replyResponse, setReplyResponse] = useState({
      business: null,
      replies: [],
      count: 0,
    });

    useEffect(() => {
      fetchReplies(0);
    }, []);

    const fetchReplies = (offset) => {
      setIsLoading(true);

      SpotsAPI.getReplies({ spotId, offset }, (data) => {
        setIsLoading(false);

        if (data) {
          if (offset === 0) {
            setReplyResponse(data);
          } else {
            setReplyResponse((obj) => {
              return {
                ...obj,
                replies: unionBy(obj.replies, data, "id"),
              };
            });
          }
        }

        if (offset == 0) {
          setIsNotFound(isEmpty(data.replies));
        }
      });
    };

    return { replyResponse, fetchReplies, ...sharedProps };
  }

  fetchSpots = (options) => {
    const { spotOffset: offset, businessId } = options;

    setIsLoading(true);

    SpotsAPI.getByBusinessId({ offset, businessId }, (data) => {
      if (data) {
        if (offset == 0) {
          setSpots(data);
        } else {
          setSpots((spots) => {
            return unionBy(spots, data, "id");
          });
        }
      }

      endLoading(data);
    });
  };

  const appendSpot = (spot) => {
    setSpots((spots) => {
      return unionBy([spot], spots, "id");
    });
  };

  const removeSpot = (spot) => {
    setSpots((spots) => {
      return spots.filter((s) => s.id !== spot.id);
    });
  };

  const replyToSpot = (spot) => {
    setSpots((spots) => {
      return spots.map((s) => {
        if (s.id === spot.id) {
          return { ...s, is_replied: true };
        }

        return s;
      });
    });
  };

  if (businessId) {
    useEffect(() => {
      fetchSpots();
    }, []);

    useEffect(() => {
      if (isMounted.current && isEmpty(spots) && !isNotFound) {
        setIsNotFound(true);
      }
    }, [spots]);

    fetchSpots = (offset = 0) => {
      setIsLoading(true);

      SpotsAPI.getByBusinessId({ offset, businessId }, (data) => {
        if (data) {
          if (offset == 0) {
            setSpots(data);
          } else {
            setSpots((spots) => {
              return unionBy(spots, data, "id");
            });
          }
        }

        isMounted.current = true;

        endLoading(data);
      });
    };
  }

  return {
    spots,
    setSpots,
    fetchSpots,
    replyToSpot,
    appendSpot,
    removeSpot,

    ...sharedProps,
  };
};

export default useSpots;
