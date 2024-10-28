import { createSelector, createSlice } from "@reduxjs/toolkit";
import { remove, size, xor } from "lodash";
import { INITIAL_FEED_REDUCER } from "../initialStates";

const feedReducer = createSlice({
  name: "feeds",
  initialState: INITIAL_FEED_REDUCER,
  reducers: {
    setFeeds: (state, action) => {
      state.feeds = {
        ...state.feeds,
        ...action.payload,
      };
    },

    incrementMoments: (state, action) => {
      state.feeds.mentionedMoments.push(action.payload);
    },

    decrementMoments: (state, action) => {
      state.feeds.mentionedMoments = remove(
        state.feeds.mentionedMoments,
        (moment) => {
          return moment.id === action.payload;
        }
      );

      state.feeds.seenMoments = remove(state.feeds.seenMoments, (moment) => {
        return moment.id === action.payload;
      });
    },

    incrementRequests: (state, action) => {
      state.feeds.friendRequests.push(action.payload);
    },

    decrementRequests: (state, action) => {
      state.feeds.friendRequests = remove(
        state.feeds.friendRequests,
        (request) => {
          return request.id === action.payload;
        }
      );

      state.feeds.seenRequests = remove(state.feeds.seenRequests, (request) => {
        return request.id === action.payload;
      });
    },

    incrementSpotReplies: (state, action) => {
      const spotId = action.payload;

      const index = state.feeds.spotReplies.findIndex((feed) => {
        return feed.id === spotId;
      });

      if (index !== -1) {
        state.feeds.spotReplies[index].count++;
      } else {
        state.feeds.spotReplies = [
          ...state.feeds.spotReplies,
          { id: spotId, count: 1 },
        ];
      }
    },

    /* When open mention mentionedMoments screen */
    readFeeds: (state) => {
      state.feeds.seenMoments = state.feeds.mentionedMoments;
      state.feeds.seenRequests = state.feeds.friendRequests;
    },

    readSpotRepliesState: (state) => {
      state.feeds.seenSpotReplies = state.feeds.spotReplies;
    },

    clearFeedState: (state) => {
      state.feeds = INITIAL_FEED_REDUCER.feeds;
    },
  },
});

export const {
  setFeeds,
  incrementMoments,
  incrementRequests,
  incrementSpotReplies,

  decrementMoments,
  decrementRequests,
  readFeeds,
  clearFeedState,
  readSpotRepliesState,
} = feedReducer.actions;

const getFeeds = (state) => state.feeds.feeds;

export const getFeedsUnreadCount = createSelector([getFeeds], (feeds) => {
  const {
    mentionedMoments,
    seenMoments,
    friendRequests,
    seenRequests,
    spotReplies,
    seenSpotReplies,
  } = feeds;

  const unseenMoments = xor(mentionedMoments, seenMoments);
  const unseenRequests = xor(friendRequests, seenRequests);
  const unseenSpotReplies = xor(spotReplies, seenSpotReplies);

  const uniqueUnseenSpotReplies = [];

  unseenSpotReplies.forEach((item) => {
    const [spotId] = item.split(":");

    if (!uniqueUnseenSpotReplies.includes(spotId)) {
      uniqueUnseenSpotReplies.push(spotId);
    }
  });

  return {
    momentsCount: size(unseenMoments),
    requestsCount: size(unseenRequests),
    spotRepliesCount: size(uniqueUnseenSpotReplies),
  };
});

export const getFeedsTotalUnreadCount = (state) => {
  const { momentsCount, requestsCount } = getFeedsUnreadCount(state);

  return momentsCount + requestsCount;
};

export const getFeedsCount = createSelector([getFeeds], (feeds) => {
  return {
    momentsCount: size(feeds.mentionedMoments),
    requestsCount: size(feeds.friendRequests),
    spotRepliesCount: size(feeds.spotReplies),
    myEventsCount: feeds.myEventsCount,
  };
});

export default feedReducer.reducer;
