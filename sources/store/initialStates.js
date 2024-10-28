export const INITIAL_USER_MOMENT = {
  content: "",
  parts: [],
  duration: 60 * 4, // 4h default duration

  is_anonymous: false,

  source: null,
  business_tag: null,
  url_tag: null,
  location_tag: null,
};

export const INITIAL_MOMENT_REDUCER = {
  /* User moments ( HomeScreen ) */
  moments: [],

  /* My current moments */
  myMoments: [],
  myMomentsLoaded: false,

  /* Feed moments where I was tagged */
  myFeedMoments: [],
};

export const INITIAL_USER_POSITION = {
  coordinate: undefined,
  city: undefined,
  is_city: undefined,

  /* Used to uniquely identify place even if written in different languages; it depends on API used for the geolocation */
  place_id: undefined,
};

export const INITIAL_USER_REDUCER = {
  user: {
    id: null,
    picture: null,

    username: "",
    name: "",
    bio: "",

    /* Additional contacts info */
    instagram: null,
    link: null,

    language: "en",

    isBusiness: false,

    hasProfile: false,

    hasBusiness: false,

    /* To know during login if the user has multiple businesess */
    hasMultipleBusinesses: false,
  },

  permissionsGranted: {
    camera: false,
    media: false,
    location: false,

    /* null means it's not already "granted" or "denied" */
    notifications: null,
  },

  /* The notifications token is set when the app is open for the first time, or notification permissions change */
  deviceToken: {
    value: null,

    /* To know if the device token has already been uploaded */

    isSent: false,
  },

  /* Position and track if the wathing is already on */

  position: INITIAL_USER_POSITION,

  /* Used when the user search for a city where it's not in */

  fakePosition: INITIAL_USER_POSITION,

  isUserPositionLoaded: false,
};

export const INITIAL_EDIT_BUSINESS = {
  name: "",
  categories: [],
  amenities: [],

  location: {
    address: "",
    coordinate: {
      latitude: null,
      longitude: null,
    },
    city: null,
    country: null,
  },

  phone: {
    code: "",
    number: "",
  },

  timetable: null,
  description: "",
  price_target: 2,

  ticket_url: null,
  web_url: null,
  instagram: null,
  nearby_info: null,

  allow_chat: true,

  cover_source: null,

  menu_url: "",
  extra_data: {
    custom_categories: [],
    custom_amenities: [],
  },
};

export const INITIAL_BUSINESS_REDUCER = {
  /* Venues list */
  businesses: [],

  /* Obtained using top right filters */
  filtered: [],

  /* Cached venues that are not in venues list, for example loaded using id */
  cached: [],

  /* Ranked venues */
  ranked: [],

  /* Current user business selected */
  currentBusiness: null,

  /* Features */
  categories: [],
  amenities: [],

  myBusinesses: [],

  /* Used in edit or create business */
  editBusiness: INITIAL_EDIT_BUSINESS,
};

export const INITIAL_LOGIN_DATA = {
  phone: { number: "", flag: "🇮🇹", code: "+39" },
  name: "",
  username: "",
  sid: "",
  picture: null,
};

export const INITIAL_UTILITY_REDUCER = {
  /* Temporary values used across screen navigation */
  blockedUsers: [],

  /* Search recents */
  recentSearch: [],

  /* Temporary data when the user logs in */
  loginData: INITIAL_LOGIN_DATA,

  /* To track if the device can establish a connection with the server, or the server is not responding */
  isServerReachable: true,
};

const INITIAL_SETTINGS = {
  notifications: null,
};

export const INITIAL_SETTINGS_REDUCER = {
  tutorial: {
    moments: false,
    events: false,
    venues: false,
    spots: false,
    createMoment: false,
  },

  userSettings: INITIAL_SETTINGS,
  businessSettings: INITIAL_SETTINGS,
};

export const INITIAL_FEED_REDUCER = {
  feeds: {
    /* A list of ids */
    mentionedMoments: [],
    friendRequests: [],
    spotReplies: [],

    myEventsCount: 0,

    seenMoments: [],
    seenRequests: [],
    seenSpotReplies: [],
  },
};
