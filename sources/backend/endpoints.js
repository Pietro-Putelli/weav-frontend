const PRIVATE_IP = "192.168.1.9";

const Development = {
  DOMAIN_NAME: `${PRIVATE_IP}:8000`,
  DOMAIN: `http://${PRIVATE_IP}/`,
  PUBLIC_DOMAIN: `http://${PRIVATE_IP}/`,
  API_DOMAIN: `http://${PRIVATE_IP}:8000/`,
  WEBSOCKET_DOMAIN: `ws://${PRIVATE_IP}:8000/ws/`,
};

const DNS_NAME = "api.weav.it";

const Production = {
  DOMAIN_NAME: DNS_NAME,
  DOMAIN: `http://${DNS_NAME}`,
  PUBLIC_DOMAIN: "weav.it",
  API_DOMAIN: `http://${DNS_NAME}/`,
  WEBSOCKET_DOMAIN: `ws://${DNS_NAME}/ws/`,
};

const Source = Production;

export const DOMAIN_NAME = Source.DOMAIN_NAME;
export const DOMAIN = Source.DOMAIN;
export const PUBLIC_DOMAIN = Source.PUBLIC_DOMAIN;
export const API_DOMAIN = Source.API_DOMAIN;
export const MEDIA_DOMAIN = "https://weav-app.s3.eu-central-1.amazonaws.com";

export const WEBSOCKET_DOMAIN = Source.WEBSOCKET_DOMAIN;

export const USER_DOMAIN = API_DOMAIN + "users/";
const PROFILE_DONAIN = API_DOMAIN + "profiles/";
const MOMENTS_DOMAIN = API_DOMAIN + "moments/";
const SPOTS_DOMAIN = API_DOMAIN + "spots/";
const EVENT_MOMENTS_DOMAIN = API_DOMAIN + "moments/event/";
export const BUSINESS_DOMAIN = API_DOMAIN + "business/";
const POST_DOMAIN = API_DOMAIN + "posts/";

const CHAT_DOMAIN = API_DOMAIN + "chat/";
const BUSINESS_CHAT_DOMAIN = CHAT_DOMAIN + "business/";

export const CHANCE_DOMAIN = API_DOMAIN + "chance/";

const DISCUSSION_DOMAIN = API_DOMAIN + "discussions/";

/* Event Activities */
const EVENT_ACTIVITY_DOMAIN = API_DOMAIN + "event-activity/";
const EVENT_ACTIVITY_MATCH_DOMAIN = EVENT_ACTIVITY_DOMAIN + "matches/";

const INSIGHTS_DOMAIN = API_DOMAIN + "insights/";
const REPOSTS_DOMAIN = API_DOMAIN + "reposts/";

export const DEVICE_DOMAIN = API_DOMAIN + "devices/";

const UserEndpoints = {
  REQUEST_LOGIN_OTP: USER_DOMAIN + "login-otp/",
  VERIFY_LOGIN_OTP: USER_DOMAIN + "login-otp/verify/",

  PHONE_SIGN_UP: USER_DOMAIN + "phone-signup/",
  USERNAME_SIGN_UP: USER_DOMAIN + "username-signup/",

  LOGIN_WITH_TOKEN: USER_DOMAIN + "token-login/",

  LOGIN_AS_BUSINESS: USER_DOMAIN + "login-as-business/",
  ACCEPT_TERMS: USER_DOMAIN + "accept-terms/",

  CHECK_USERNAME_EXISTENCE: USER_DOMAIN + "exists/",

  VERIFY_SOCIAL_LOGIN: USER_DOMAIN + "social/verify/",
  SOCIAL_LOGIN: USER_DOMAIN + "social/login/",
};

const ProfileEndpoints = {
  UPDATE_USER_PROFILE: PROFILE_DONAIN + "update/",
  UPDATE_LANGUAGE: PROFILE_DONAIN + "update/language/",
  CHANGE_PROFILE_PICTURE: PROFILE_DONAIN + "update/picture/",

  /* APIView endpoints */
  PROFILE_SETTINGS: PROFILE_DONAIN + "settings/",
  USER_DEVICE_TOKEN: PROFILE_DONAIN + "device-token/",

  BLOCK_USER: PROFILE_DONAIN + "block/",
  SEARCH_USERS: PROFILE_DONAIN + "search/",
  RECENT_USERS: PROFILE_DONAIN + "recent/",

  USER_PROFILE: PROFILE_DONAIN,
  USER_FEEDS: PROFILE_DONAIN + "feeds/",

  FRIEND: PROFILE_DONAIN + "friend/",
  FRIEND_REQUEST: PROFILE_DONAIN + "friend/request/",

  SET_PUBLIC_KEY: PROFILE_DONAIN + "publickey/",
};

const MomentEndpoints = {
  USER_MOMENTS: MOMENTS_DOMAIN + "user/",
  GET_USER_MOMENTS: MOMENTS_DOMAIN + "user/get/",

  USER_MOMENTS_BY_ID: MOMENTS_DOMAIN + "user/get/id/",
  USER_MOMENT_PARTICIPANTS: MOMENTS_DOMAIN + "participants/",

  BUSINESS_MOMENTS: MOMENTS_DOMAIN + "business/",
};

const SpotEndpoints = {
  ROOT_SPOT: SPOTS_DOMAIN,
  REPLY_SPOT: SPOTS_DOMAIN + "reply/",
  GET_MY_SPOTS: SPOTS_DOMAIN + "mine/",
  GET_SPOT_REPLIES: SPOTS_DOMAIN + "replies/",
};

const EventEndpoints = {
  ROOT_EVENT: EVENT_MOMENTS_DOMAIN,

  GET_EVENTS: EVENT_MOMENTS_DOMAIN + "get/",
  GET_EVENT_DETAIL: EVENT_MOMENTS_DOMAIN + "detail/",
  GET_EVENT_PARTICIPANTS: EVENT_MOMENTS_DOMAIN + "participants/",

  GET_MY_EVENTS: EVENT_MOMENTS_DOMAIN + "mine/",
  PUT_USER_GOING: EVENT_MOMENTS_DOMAIN + "going/",

  GET_BUSINESS_EVENTS: EVENT_MOMENTS_DOMAIN + "business/",
};

const ChatEndpoints = {
  /* APIView used to create and delete chats */
  CHAT: CHAT_DOMAIN,

  USER_MESSAGES: CHAT_DOMAIN + "messages/user/",
  BUSINESS_MESSAGES: CHAT_DOMAIN + "messages/business/",

  CHAT_USER_ID: CHAT_DOMAIN + "user/",

  MUTE: CHAT_DOMAIN + "mute/",
  READ_MESSAGES: CHAT_DOMAIN + "read/",
  SEARCH_CHATS: CHAT_DOMAIN + "search/",

  /* To send reactions and stories */
  SHARE_MOMENT: CHAT_DOMAIN + "share/moment/",
  SHARE_PROFILE: CHAT_DOMAIN + "share/profile/",
  SHARE_REACTION: CHAT_DOMAIN + "share/reaction/",

  /* APIView to handle BusinessChat */
  BUSINESS_CHAT_CREATE: BUSINESS_CHAT_DOMAIN + "create/",
  BUSINESS_CHAT_GET: BUSINESS_CHAT_DOMAIN + "get/",
  BUSINESS_CHAT_ID: BUSINESS_CHAT_DOMAIN + "id/",
  BUSINESS_READ_MESSAGES: BUSINESS_CHAT_DOMAIN + "read/",
};

const DiscussionEndpoints = {
  MUTE: DISCUSSION_DOMAIN + "mute/",
  DELETE: DISCUSSION_DOMAIN + "delete/",
  MESSAGES: DISCUSSION_DOMAIN + "messages/",
};

const BusinessEndpoints = {
  BUSINESS: BUSINESS_DOMAIN,
  BUSINESS_CREATE: BUSINESS_DOMAIN + "create/",

  BUSINESSES: BUSINESS_DOMAIN + "get/",
  BUSINESS_ID: BUSINESS_DOMAIN + "get/id/",

  MY_BUSINESS: BUSINESS_DOMAIN + "get/mine/",

  CURRENT_MOMENT: BUSINESS_DOMAIN + "moment/",

  BUSINESS_LIKE: BUSINESS_DOMAIN + "like/",
  SEARCH: BUSINESS_DOMAIN + "search/",

  TOP_RANKED: BUSINESS_DOMAIN + "ranked/",

  BUSINESS_SETTINGS: BUSINESS_DOMAIN + "settings/",

  GET_SPOT_BUSINESSES: BUSINESS_DOMAIN + "spot/",
};

const PostEndpoints = {
  USER_POSTS: POST_DOMAIN + "user/",
  BUSINESS_POST: POST_DOMAIN + "business/",

  BUSINESS_POSTS: POST_DOMAIN + "business/get/",
};

const InsightsEndpoints = {
  OVERVIEW: INSIGHTS_DOMAIN + "overview/",
  DETAILS: INSIGHTS_DOMAIN + "detail/",
  EVENT: INSIGHTS_DOMAIN + "event/",
};

const RepostsEndpoints = {
  USER_PROFILE: REPOSTS_DOMAIN + "user/",
  BUSINESS_PROFILE: REPOSTS_DOMAIN + "business/",
  USER_MOMENT: REPOSTS_DOMAIN + "user-moment/",
  BUSINESS_MOMENT: REPOSTS_DOMAIN + "business-moment/",
  USER_POST: REPOSTS_DOMAIN + "user-post/",
  BUSINESS_POST: REPOSTS_DOMAIN + "business-post/",
};

const DeviceEndpoints = {
  DEVICE_LOGOUT: DEVICE_DOMAIN + "logout/",
};

const EventActivityEndpoints = {
  GET__CURRENT: EVENT_ACTIVITY_DOMAIN + "current/",
  GET__PARTICIPANTS: EVENT_ACTIVITY_DOMAIN + "participants/",
  POST__MEMBERSHIP: EVENT_ACTIVITY_DOMAIN + "membership/",

  MATCH__CREATE: EVENT_ACTIVITY_MATCH_DOMAIN + "create/",
  MATCH__ACCEPT: EVENT_ACTIVITY_MATCH_DOMAIN + "accept/",
  MATCH__SKIP: EVENT_ACTIVITY_MATCH_DOMAIN + "skip/",
  MATCH__COMPLETE: EVENT_ACTIVITY_MATCH_DOMAIN + "complete/",
};

export {
  BusinessEndpoints,
  ChatEndpoints,
  DeviceEndpoints,
  DiscussionEndpoints,
  EventActivityEndpoints,
  EventEndpoints,
  InsightsEndpoints,
  MomentEndpoints,
  PostEndpoints,
  ProfileEndpoints,
  RepostsEndpoints,
  SpotEndpoints,
  UserEndpoints,
};
