import { createSlice } from "@reduxjs/toolkit";
import { unionBy } from "lodash";

const businessPosts = createSlice({
  name: "posts",
  initialState: {
    /* My business profile posts */
    myPosts: [],

    /* All the business' posts */
    posts: [],
  },
  reducers: {
    setMyBusinessPosts: (state, action) => {
      state.myPosts = action.payload;
    },

    setBusinessPosts: (state, action) => {
      const { businessId, posts } = action.payload;

      const businessPosts = posts.map((post) => {
        return { ...post, business_id: businessId };
      });

      state.posts = unionBy(state.posts, businessPosts, "id");
    },

    createMyBusinessPost: (state, action) => {
      state.myPosts = unionBy([action.payload], state.myPosts, "id");
    },

    updateMyBusinessPost: (state, action) => {
      const post = action.payload;
      const postId = post.id;

      const index = state.myPosts.findIndex((post) => {
        return post.id === postId;
      });

      if (index !== -1) {
        state.myPosts[index] = post;
      }
    },

    deleteMyBusinessPost: (state, action) => {
      const postId = action.payload;

      state.myPosts = state.myPosts.filter((post) => {
        return post.id !== postId;
      });
    },

    deleteMyBusinessPostSlice: (state, action) => {
      const { postId, sliceId } = action.payload;

      const index = state.myPosts.findIndex((post) => {
        return post.id === postId;
      });

      if (index !== -1) {
        const post = state.myPosts[index];

        post.slices = post.slices.filter((slice) => {
          return slice.id !== sliceId;
        });

        if (post.slices.length === 0) {
          state.myPosts.splice(index, 1);
        } else {
          state.myPosts[index] = post;
        }
      }
    },
  },
});

export const {
  createMyBusinessPost,
  updateMyBusinessPost,
  deleteMyBusinessPost,
  deleteMyBusinessPostSlice,
  setMyBusinessPosts,
  setBusinessPosts,
} = businessPosts.actions;

export const getMyBusinessPostsState = (state) => {
  return state.businessPosts.myPosts;
};

export const getBusinessPostsState = (state, businessId) => {
  return state.businessPosts.posts.filter((post) => {
    return post.business_id === businessId;
  });
};

export default businessPosts.reducer;
