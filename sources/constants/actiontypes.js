/* Handle all possible actions, for example a modal that handle more than one functionality */
const actiontypes = {
  /* Handle menu modal */
  MENU_MODAL: {
    MY_PROFILE: "my_profile",
    VENUE_MORE: "venue_more",
    CHAT: "chat",
    DISCUSSION: "discussion",
    PROFILE_PICTURE: "profile_picture",
    USER_PROFILE: "user_profile",
    MY_STORY_SETTINGS: "my_story_settings",
    EDIT_POST: "edit-post",

    MOMENT_MENU: "moment-menu",
    POST_MORE: "post-more",
    POST_SORT: "post-sort",

    USER_TAGGED_EVENT_MOMENT: "actions-for-user-moments-where-business-tagged",
    BUSINESS_SHARE_OUTSIDE: "business-share-outside",
    EVENT_MOMENT_OPTIONS: "event-moment-options",
    USER_TAGGED_IN_MOMENT: "my-user-tagged-in-moment",

    EVENT_DETAIL_MORE: "event-detail-more",
    SPOT_DETAIL: "spot-detail-more",
    EVENT_MATCH: "event-match",
  },

  /* Handle SearchScreen */
  SEARCH_SCREEN: {
    CITY: "search_city",
    CLUBS: "search_club",
    CHATS: "search_chat",
  },

  /* Handle successfulModal */
  SUCCESSFUL_MODAL: {
    REGISTER: "register",
    CREATE_VENUE: "create-venue",
  },

  /* EditPost type to get slices */
  EDIT_POST: {
    VENUE: "venue",
    USER: "user",
  },

  /* Used to distinguish settings */
  SETTINGS: {
    ADVANCED: "advanced-settings",
    LIKED_VENUES: "liked-venues",
    NOTIFICATIONS: "notifications",
    BLOCKED_USERS: "blocked-users",
    FRIENDS_LIST: "user-friends-list",
    CHANCES: "user-chances",
    MESSAGES: "user-message-settings",
    QR_CODE: "user-qr-code",
  },

  CROP_TYPES: {
    USER: "user-profile",
    VENUE: "venue-cover",
  },

  USER_MOMENTS_SCREEN: {
    TAGS: "user-moments-tagged-business",
    ARCHIVDED: "business-archived-moments",
  },

  PHONE_OTP: {
    REGISTER: "phone-otp-for-user-registration",
  },

  TUTORIAL: {
    USER_PROFILE: "user-profile",
    NOTIFICATIONS: "notifications",

    MOMENTS: "user-moments",
    EVENTS: "events",

    ACTIVITY_EVENTS: "activity-events",
  },

  PICKERS: {
    DATE: "date",
    TIME: "time",
    DURATION: "duration",
    PERIODIC_DATE: "periodic-date",
  },

  EDIT_BUSINESS: {
    TITLE: "title",
    CATEGORIES: "categories",
    AMENITIES: "amenities",
    PHONE: "phone",
    DESCRIPTION: "description",
    MORE_INFO: "more-info",
    RESERVE_OPTIONS: "reserve-options",
    TIMETABLE: "timetable",
  },

  SHARE_TYPES: {
    EVENT: "event",
    BUSINESS: "business",
  },
};

export default actiontypes;
