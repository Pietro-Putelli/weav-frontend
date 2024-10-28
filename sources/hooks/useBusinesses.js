import { isEmpty, isUndefined, omit, pickBy } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BusinessAPI from "../backend/business";
import { getCurrentUTCDate } from "../dates/functions";
import { getMyBusinessPostsState } from "../store/slices/businessPostsReducer";
import {
  getBusinessByIdState,
  getBusinessesByExperienceTypeState,
  getFilteredBusinessesState,
  setBusinessById,
  setBusinesses,
  setFilteredBusinesses,
} from "../store/slices/businessesReducer";
import { numberize } from "../utility/functions";
import useCurrentLocation from "./useCurrentLocation";

export const INITIAL_FETCH_OPTIONS = {
  offset: 0,
  filters: [],
  price_target: 0,
  type: 0,
  closed_too: false,
};

export const BUSINESS_TYPE = {
  SPOTS: "spots",
};

const useBusinesses = ({
  businessId,
  category,
  isPreview,
  initialBusiness,
  type,
} = {}) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  /* Methods */

  const endLoading = (data) => {
    setIsLoading(false);
    setIsRefreshing(false);

    if (data) {
      setIsNotFound(isEmpty(data));
    }
  };

  if (category) {
    const [rankedBusinesses, setRankedBusinesses] = useState([]);

    useEffect(() => {
      setIsLoading(true);

      BusinessAPI.getTopRanked(category, (data) => {
        setIsLoading(false);

        if (data) {
          setRankedBusinesses(data);
        }
      });
    }, []);

    return { businesses: rankedBusinesses, isLoading };
  }

  if (isPreview) {
    const posts = useSelector(getMyBusinessPostsState);

    return {
      hasPosts: !isEmpty(posts),
    };
  }

  if (businessId) {
    const business = useSelector((state) => {
      return getBusinessByIdState(state, businessId);
    });

    const hasBusinessPosts = business?.has_posts;

    /* Use has_post == undefined to check if the business hasn't been fully loaded */
    const isFullyLoaded = !isUndefined(hasBusinessPosts);

    useEffect(() => {
      if (!isFullyLoaded) {
        setIsLoading(true);

        BusinessAPI.getById(businessId, (business) => {
          if (business) {
            dispatch(setBusinessById(business));
          }

          endLoading();
        });
      }
    }, [business]);

    return {
      business: business ?? initialBusiness,
      hasPosts: hasBusinessPosts != false,
      isLoading,
      isFullyLoaded,
    };
  }

  if (type === BUSINESS_TYPE.SPOTS) {
    const [businesses, setBusinesses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);

    const fetchBusinesses = (options, callback) => {
      const offset = options?.businessOffset;

      setIsLoading(true);

      BusinessAPI.getSpots(offset, (data) => {
        if (data) {
          setBusinesses(data);
        }

        setIsNotFound(isEmpty(data));
        setIsLoading(false);

        callback?.(data);
      });
    };

    const removeBusiness = (businessId) => {
      setBusinesses((businesses) => {
        return businesses.filter((business) => business.id !== businessId);
      });
    };

    return {
      businesses,
      fetchBusinesses,
      removeBusiness,

      isLoading,
      isNotFound,
    };
  }

  /* Venues List here */

  const [fetchOptions, setFetchOptions] = useState(INITIAL_FETCH_OPTIONS);
  const [isChangingType, setIsChangingType] = useState(false);

  const experienceType = fetchOptions.type;

  const getHasFilters = useCallback((options) => {
    const { filters, price_target, closed_too } = options;

    return !isEmpty(filters) || price_target != 0 || closed_too === true;
  }, []);

  const hasFilters = getHasFilters(fetchOptions);

  const businesses = useSelector((state) => {
    if (hasFilters) {
      return getFilteredBusinessesState(state);
    }

    return getBusinessesByExperienceTypeState(state, experienceType);
  });

  /* Effects */

  useCurrentLocation(() => {
    fetchBusinesses(INITIAL_FETCH_OPTIONS);
  }, []);

  /* Methods */

  const formatPostParams = (filters) => {
    const categories = [];
    const amenities = [];

    filters.forEach((filter) => {
      const filterId = filter.id;

      if (filterId.includes("category")) {
        categories.push(numberize(filterId));
      } else {
        amenities.push(numberize(filterId));
      }
    });

    return pickBy({ categories, amenities }, (value) => !isEmpty(value));
  };

  const updateFetchOptions = (options) => {
    const newOptions = { ...fetchOptions, ...options };

    setFetchOptions(newOptions);

    fetchBusinesses(newOptions);
  };

  const fetchBusinesses = (options) => {
    const { offset, filters, type: experienceType } = options;

    const mode = offset == 0 ? "set" : "append";
    const formattedFilters = formatPostParams(filters);

    const currentUTCDate = getCurrentUTCDate();

    const postPrams = omit(
      { date: currentUTCDate, ...options, ...formattedFilters },
      ["filters"]
    );

    setIsLoading(true);

    const hasFilters = getHasFilters(options);

    BusinessAPI.get(postPrams, (resposeData) => {
      const data = resposeData ?? [];

      endLoading(data);

      setIsChangingType(false);

      if (!hasFilters) {
        dispatch(setBusinesses({ data, mode, experienceType }));
      } else {
        dispatch(setFilteredBusinesses({ data, mode }));
      }
    });
  };

  return {
    isLoading,
    isChangingType,
    hasFilters,
    isRefreshing,
    isNotFound,
    businesses,
    fetchOptions,
    updateFetchOptions,
  };
};

export default useBusinesses;
