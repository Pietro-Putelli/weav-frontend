import { isEmpty, isUndefined, pick, size } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrUpdateMyPost,
  deleteMyPost,
  getUserPosts,
} from "../backend/posts";
import {
  createMyProfilePost,
  getMyProfilePostsState,
  getUserPostsState,
  setMyProfilePosts,
  setUserPosts,
  updateMyProfilePost,
} from "../store/slices/userPostsReducer";
import useUser from "./useUser";
import { isInFileSystem } from "../backend/formatters/utility";

export const UserPostMethods = { CREATE: "CREATE" };

const useUserPosts = ({ method, userId, initialPost }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidSource, setIsInvalidSource] = useState(false);

  const dispatch = useDispatch();

  if (method === UserPostMethods.CREATE) {
    const [post, setPost] = useState({
      source: null,
      title: "",
      content: "",
    });

    const isEditing = !isUndefined(initialPost);
    const postId = initialPost?.id;

    useEffect(() => {
      setIsInvalidSource(false);
    }, [post.source]);

    useEffect(() => {
      if (isEditing) {
        setPost(initialPost);
      }
    }, []);

    /* Methods */

    const updatePostState = (props) => {
      setPost((post) => {
        return { ...post, ...props };
      });
    };

    const _createFormData = () => {
      const formData = new FormData();

      const sourceUri = post.source?.uri;

      if (isInFileSystem(sourceUri)) {
        formData.append("source", {
          uri: sourceUri,
          name: "source.png",
          type: "image/png",
        });
      }

      const data = {
        ...pick(post, ["title", "content"]),
        post_id: postId,
      };

      formData.append("data", JSON.stringify(data));

      return formData;
    };

    const createOrUpdatePost = (callback) => {
      setIsLoading(true);

      const data = _createFormData();

      if (!isLoading) {
        createOrUpdateMyPost(
          { isEditing, data },
          (post) => {
            if (post) {
              if (isEditing) {
                dispatch(updateMyProfilePost(post));
              } else {
                dispatch(createMyProfilePost(post));
              }
            }

            callback?.();
          },
          () => {
            setIsLoading(false);
            setIsInvalidSource(true);
          }
        );
      }
    };

    const deletePost = (callback) => {
      dispatch(deleteMyPost(postId, callback));
    };

    return {
      post,
      isEditing,
      isLoading,
      isInvalidSource,

      updatePostState,
      createOrUpdatePost,
      deletePost,
    };
  }

  const [isNotFound, setIsNotFound] = useState(false);

  const { amI } = useUser({ userId });

  const posts = useSelector((state) => {
    if (amI) {
      return getMyProfilePostsState(state);
    }

    return getUserPostsState(state, userId);
  });

  const isPostsEmpty = isEmpty(posts);
  const postsCount = size(posts);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setIsNotFound(isPostsEmpty);
  }, [isPostsEmpty]);

  const fetchPosts = () => {
    setIsLoading(true);

    getUserPosts(userId, (posts) => {
      setIsNotFound(isEmpty(posts));
      setIsLoading(false);

      if (amI) {
        dispatch(setMyProfilePosts(posts));
      } else {
        dispatch(setUserPosts({ userId, posts }));
      }
    });
  };

  return {
    posts,
    postsCount,
    maxPostsReached: postsCount === 4,
    isLoading,
    isNotFound,
    setIsNotFound,
  };
};

export default useUserPosts;
