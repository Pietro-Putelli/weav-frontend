import {
  deleteMyBusinessPost,
  deleteMyBusinessPostSlice,
} from "../store/slices/businessPostsReducer";
import { deleteMyProfilePost } from "../store/slices/userPostsReducer";
import { PostEndpoints } from "./endpoints";
import {
  deleteWithAuth,
  getWithAuth,
  postFormDataWithAuth,
  putFormDataWithAuth,
} from "./methods";

const { USER_POSTS, BUSINESS_POST, BUSINESS_POSTS } = PostEndpoints;

/* USER POSTS */

export const createOrUpdateMyPost = (
  { isEditing, data },
  callback,
  invalidCallback
) => {
  (isEditing ? putFormDataWithAuth : postFormDataWithAuth)(USER_POSTS, data)
    .then(({ data }) => {
      callback(data);
    })
    .catch((error) => {
      const statusCode = error.response?.status;

      if (statusCode == 406) {
        invalidCallback();
        return;
      }

      callback?.(null);
      console.log("[create-user-post]", error);
    });
};

export const getUserPosts = (userId, callback) => {
  getWithAuth(USER_POSTS, { user_id: userId })
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback(null);
      console.log("[get-user-posts]", e);
    });
};

export const deleteMyPost = (postId, callback) => (dispatch) => {
  deleteWithAuth(USER_POSTS, { post_id: postId })
    .then(() => {
      dispatch(deleteMyProfilePost(postId));
      callback(true);
    })
    .catch((e) => {
      callback(false);
      console.log("[delete-user-post]", e);
    });
};

/* BUSINESS POSTS */

export const createOrUpdateBusinessPost = (
  { isEditing, data },
  callback,
  invalidCallback
) => {
  (isEditing ? putFormDataWithAuth : postFormDataWithAuth)(BUSINESS_POST, data)
    .then(({ data }) => {
      callback(data);
    })
    .catch((error) => {
      const statusCode = error.response?.status;

      if (statusCode == 406) {
        invalidCallback();
        return;
      }

      callback?.();
      console.log("[create-or-update-business-post]", error);
    });
};

export const deleteBusinessPost = (postId, callback) => (dispatch) => {
  deleteWithAuth(BUSINESS_POST, { post_id: postId })
    .then(() => {
      dispatch(deleteMyBusinessPost(postId));

      callback(true);
    })
    .catch((e) => {
      callback(false);
      console.log("[delete-business-post]", e);
    });
};

export const deleteBusinessPostSlice =
  ({ postId, sliceId }, callback) =>
  (dispatch) => {
    deleteWithAuth(BUSINESS_POST, { post_id: postId, slice_id: sliceId })
      .then(() => {
        dispatch(deleteMyBusinessPostSlice({ postId, sliceId }));

        callback(true);
      })
      .catch((e) => {
        callback(false);
        console.log("[delete-business-post]", e);
      });
  };

export const getMyBusinessPosts = (callback) => {
  getWithAuth(BUSINESS_POST)
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback();
      console.log("[get-business-posts]", e);
    });
};

/* Get business posts in BusinessDetailScreen */

export const getBusinessPosts = ({ offset, businessId }, callback) => {
  getWithAuth(BUSINESS_POSTS, {
    offset,
    id: businessId,
  })
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback(false);
      console.log("[get-business-posts]", e);
    });
};
