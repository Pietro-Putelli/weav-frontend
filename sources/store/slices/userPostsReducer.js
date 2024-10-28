import { createSlice } from "@reduxjs/toolkit";
import { unionBy } from "lodash";

const userPosts = createSlice({
  name: "posts",
  initialState: {
    /* My profile posts */
    myPosts: [],

    /* All the user's posts */
    posts: [],
  },
  reducers: {
    createMyProfilePost: (state, action) => {
      state.myPosts = unionBy([action.payload], state.myPosts, "id");
    },

    updateMyProfilePost: (state, action) => {
      const post = action.payload;
      const postId = post.id;

      const index = state.myPosts.findIndex((post) => {
        return post.id === postId;
      });

      if (index !== -1) {
        state.myPosts[index] = post;
      }
    },

    deleteMyProfilePost: (state, action) => {
      const postId = action.payload;

      state.myPosts = state.myPosts.filter((post) => {
        return post.id !== postId;
      });
    },

    setMyProfilePosts: (state, action) => {
      state.myPosts = action.payload;
    },

    /* Users */

    setUserPosts: (state, action) => {
      const { userId, posts } = action.payload;

      const userPosts = posts.map((post) => {
        return { ...post, user_id: userId };
      });

      state.posts = unionBy(state.posts, userPosts, "id");
    },
  },
});

export const {
  createMyProfilePost,
  updateMyProfilePost,
  deleteMyProfilePost,
  setMyProfilePosts,

  setUserPosts,
} = userPosts.actions;

export const getMyProfilePostsState = (state) => {
  return state.userPosts.myPosts;
};

export const getUserPostsState = (state, userId) => {
  return state.userPosts.posts.filter((post) => {
    return post.user_id === userId;
  });
};

export default userPosts.reducer;
