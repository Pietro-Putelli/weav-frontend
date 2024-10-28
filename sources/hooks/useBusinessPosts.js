import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessPosts, getMyBusinessPosts } from "../backend/posts";
import {
  getBusinessPostsState,
  getMyBusinessPostsState,
  setBusinessPosts,
  setMyBusinessPosts,
} from "../store/slices/businessPostsReducer";
import useCurrentBusiness from "./useCurrentBusiness";

const useBusinessPosts = ({ businessId, hasPosts, isPreview } = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const { isBusiness } = useCurrentBusiness();

  const dispatch = useDispatch();

  const sharedProps = {
    isLoading,
    isRefreshing,
    isNotFound,
    setIsNotFound,
  };

  const endCallback = (posts) => {
    setIsNotFound(isEmpty(posts));

    setIsRefreshing(false);
    setIsLoading(false);
  };

  if (isPreview) {
    const posts = useSelector(getMyBusinessPostsState);

    return { posts };
  }

  if (businessId) {
    const posts = useSelector((state) => {
      return getBusinessPostsState(state, businessId);
    });

    const isPostsEmpty = isEmpty(posts);

    useEffect(() => {
      if (isPostsEmpty && hasPosts) {
        fetchPosts();
      }
    }, []);

    const fetchPosts = () => {
      setIsLoading(true);

      getBusinessPosts({ businessId }, (posts) => {
        if (posts) {
          dispatch(setBusinessPosts({ businessId, posts }));

          setIsLoading(false);
        }
      });
    };

    return {
      posts,
      fetchPosts,
      ...sharedProps,
    };
  }

  /* My business posts */

  if (isBusiness) {
    const posts = useSelector(getMyBusinessPostsState);
    const isPostsEmpty = isEmpty(posts);
    const postsCount = posts?.length ?? 0;

    /* Effects */

    useEffect(() => {
      if (isPostsEmpty) {
        fetchPosts();
      }
    }, []);

    useEffect(() => {
      if (isNotFound) {
        setIsNotFound(isEmpty(posts));
      }
    }, [posts]);

    const fetchPosts = () => {
      getMyBusinessPosts((posts) => {
        if (posts) {
          dispatch(setMyBusinessPosts(posts));
        }

        endCallback(posts);
      });
    };

    const refreshPosts = () => {
      fetchPosts();
    };

    return {
      posts,
      postsCount,
      fetchPosts,
      refreshPosts,
      ...sharedProps,
    };
  }

  return {};
};

export default useBusinessPosts;
