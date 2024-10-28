import { configureStore } from "@reduxjs/toolkit";
import { omit, pick } from "lodash";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import createSensitiveStorage from "redux-persist-sensitive-storage";
import thunk from "redux-thunk";
import { ReduxStorage } from "./storage";

import {
  businessPostsReducer,
  businessesReducer,
  cacheReducer,
  chatsReducer,
  eventActivitesReducer,
  eventsReducer,
  feedsReducer,
  insightsReducer,
  momentsReducer,
  profilesReducer,
  secretReducer,
  settingsReducer,
  spotsReducer,
  userPostsReducer,
  userReducer,
  utilityReducer,
} from "./slices";

/* Configure Secret Storage for API Token and Private Key */

const secretStorage = createSensitiveStorage({
  sharedPreferencesName: "sharedPreferencesName",
  keychainService: "keychainService",
});

const secretStoragePersistConfig = {
  key: "secret",
  storage: secretStorage,
};

const createConfig = ({ key, whitelist, blacklist }) => {
  return { key, storage: ReduxStorage, whitelist, blacklist };
};

const userConfig = createConfig({
  key: "user",
  blacklist: ["fakePosition", "isUserPositionLoaded"],
});

const businessConfig = createConfig({
  key: "business",
  whitelist: ["currentBusiness", "myBusinesses"],
});

const utilityConfig = createConfig({
  key: "utility",
  whitelist: ["recentSearch"],
});

const eventsConfig = createConfig({
  key: "events",
  blacklist: ["myEvents"],
});

const eventActivitesConfig = createConfig({ key: "eventActivities" });

const settingsConfig = createConfig({ key: "settings" });

const feedsConfig = createConfig({ key: "feeds" });

const cacheConfig = createConfig({ key: "cache" });

const rootReducer = combineReducers({
  user: persistReducer(userConfig, userReducer),
  secret: persistReducer(secretStoragePersistConfig, secretReducer),

  moments: momentsReducer,
  events: persistReducer(eventsConfig, eventsReducer),
  business: persistReducer(businessConfig, businessesReducer),
  profiles: profilesReducer,
  userPosts: userPostsReducer,
  businessPosts: businessPostsReducer,
  chats: chatsReducer,
  insights: insightsReducer,
  settings: persistReducer(settingsConfig, settingsReducer),
  spots: spotsReducer,
  feeds: persistReducer(feedsConfig, feedsReducer),

  eventActivities: persistReducer(eventActivitesConfig, eventActivitesReducer),

  utility: persistReducer(utilityConfig, utilityReducer),
  cache: persistReducer(cacheConfig, cacheReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

export const getState = (key) => store.getState()[key];

export const getUserSecretInfoFromStore = () => {
  return store.getState().secret;
};

export const getTokenForRequest = (forceUser) => {
  const { isBusiness } = getState("user").user;

  const { userToken, businessToken } = getUserSecretInfoFromStore();

  if (forceUser) {
    return userToken;
  }

  return isBusiness ? businessToken : userToken;
};

export const getLanguage = () => {
  return getState("user").user.language;
};

export const getTutorialSettings = () => {
  return getState("settings").tutorial;
};

const FIELDS = ["coordinate", "place_id", "is_city"];

export const getUserPositionData = () => {
  let userPosition = pick(getState("user").position, FIELDS);
  let fakedUserPosition = pick(getState("user").fakePosition, FIELDS);

  if (!userPosition.is_city) {
    userPosition = omit(userPosition, ["place_id"]);
  }

  if (!fakedUserPosition.is_city) {
    fakedUserPosition = omit(fakedUserPosition, ["place_id"]);
  }

  if (fakedUserPosition.coordinate) {
    return fakedUserPosition;
  }

  return userPosition;
};

export const getUserRealPositionData = () => {
  return getState("user").position;
};
