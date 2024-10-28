import { isEmpty, unionBy } from "lodash";
import { useEffect, useState } from "react";
import { getBusinessMoments } from "../backend/moments";

const useBusinessMoments = ({ businessId }) => {
  const [moments, setMoments] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const isMomentsEmpty = isEmpty(moments);

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = (offset = 0) => {
    if (offset == 0 && !isMomentsEmpty) {
      setIsRefreshing(true);
      setIsNotFound(false);
      setMoments([]);
    }

    setIsLoading(true);

    getBusinessMoments({ businessId, offset }, (data) => {
      setIsLoading(false);
      setIsRefreshing(false);

      if (offset == 0 && isEmpty(data)) {
        setIsNotFound(true);
      }

      if (data) {
        setMoments(unionBy(moments, data, "id"));
      }
    });
  };

  const appendMoment = (moment) => {
    setMoments((moments) => {
      return unionBy([moment], moments, "id");
    });
  };

  const removeMoment = (momentId) => {
    setMoments((moments) => {
      const newMoments = moments.filter((moment) => moment.id != momentId);

      setIsNotFound(isEmpty(newMoments));

      return newMoments;
    });
  };

  return {
    moments,
    isLoading,
    isRefreshing,
    isNotFound,
    isMomentsEmpty,

    fetchMoments,
    appendMoment,
    removeMoment,
  };
};

export default useBusinessMoments;
