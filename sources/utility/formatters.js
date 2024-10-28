import { omit, pick } from "lodash";
import { formatTimeTableDateTime } from "../dates/timetable";
import { CHAT_TYPES } from "../hooks/useChat";
import { getLanguageContent } from "../hooks/useLanguages";

export const formatMessagePreview = ({
  message: {
    sender,
    user_profile,
    business_profile,
    moment,
    event,
    reaction,
    content,
  },
  I,
  chatType,
}) => {
  const { languageContent, language } = getLanguageContent();

  const subject = language == "en" ? "You" : "Tu";

  if (chatType == CHAT_TYPES.DISCUSSION) {
    const username = I.id == sender.id ? subject : sender.username;

    return `${username}: ${content}`;
  }

  if (content && !reaction) {
    return content;
  }

  const amI = I.id == sender;

  if (user_profile) {
    const { username } = user_profile;

    if (language == "en") {
      return `Shared ${username}'s profile`;
    }

    return `${languageContent.chat_messages.shared_profile} ${username}`;
  } else if (business_profile) {
    const { name } = business_profile;

    if (language == "en") {
      return `${amI ? "You s" : "S"}hare ${name}`;
    }

    return `${amI ? "Hai" : "Ha"} condiviso ${name}`;
  } else if (moment) {
    const { user } = moment;

    if (reaction) {
      if (I.id == user.id) {
        return languageContent.chat_messages.your_moment_reaction;
      } else {
        return `${content} ${languageContent.chat_messages.its_moment_reaction}`;
      }
    }

    if (language == "en") {
      return `${amI ? "You s" : "S"}hare ${user.username}'s moment`;
    }

    return `${amI ? "Hai" : "Ha"} condiviso il momento di ${user.username}`;
  } else if (event) {
    const { title } = event;

    if (language == "en") {
      return `${amI ? "You s" : "S"}hare ${title}`;
    }

    return `${amI ? "Hai" : "Ha"} condiviso ${title}`;
  } else if (reaction?.toLowerCase() == "hey") {
    return `✌️ hey`;
  }

  return content;
};

/* isPlain means without space between prefix and phone number */
export const formatPhone = ({ phone, isPlain = false }) => {
  const code = phone?.code;
  const number = phone?.number;

  if (number == "" || number == undefined || number == null) {
    return "";
  }

  if (isPlain) {
    return `${code}${number}`;
  }

  const phoneNumber = `${code} ${number}`;

  if (phoneNumber.includes("+")) {
    return phoneNumber;
  }

  return `+${phoneNumber}`;
};

export const formatBusinessPreview = (business) => {
  const timetable = business?.timetable;

  const preview = {
    ...business,
    has_posts: false,
    me: {
      distance: "0 m",
      liked: false,
      rating: 0,
    },
    likes: 0,
    ranking: null,
    moment: null,
  };

  if (timetable) {
    preview.timetable = formatTimeTableDateTime(business.timetable);
  }

  return preview;
};

export const coordinateToArray = ({ longitude, latitude }) => {
  return [longitude, latitude];
};

export const formatCoordinateToObject = (coordinate) => {
  return {
    longitude: coordinate[0],
    latitude: coordinate[1],
  };
};

export const formatLargeNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
};

/* Extract all tagged users (@pietro.putelli or @pietro) from texts prop */
export const getTaggedUsernames = (value) => {
  if (value) {
    const response = value.match(
      /\B@[a-zA-Z0-9_](?:[a-zA-Z0-9_.]*[a-zA-Z0-9_])*/g
    );
    if (response != null) return response.map((name) => name.replace("@", ""));
  }
  return [];
};

/* Use to format local images uri */
export const formatTakenPictureUri = (uri) => {
  return Platform.OS === "ios" ? uri : "file://" + uri;
};

/* Use to format url in case it does not contains https or contains http */
export const formatUrlSchema = (url) => {
  if (url.includes("https://") || url.includes("http://")) {
    if (url.includes("http://")) {
      return url.replace("http://", "https://");
    }
  }

  if (!url.includes("https://")) {
    return `https://${url}`;
  }

  return url;
};

export const formatMomentPreview = ({ moment, user }) => {
  const url_tag = moment?.url_tag;
  const location_tag = moment?.location_tag;
  const business_tag = moment?.business_tag;

  const momentSource =
    moment?.source ??
    business_tag?.source ??
    business_tag?.cover_source ??
    moment?.uri ??
    moment?.source;

  let preview = omit(
    {
      ...moment,
      source: pick(momentSource, ["uri", "width", "height"]),
      user,
    },
    ["cover_source", "uri"]
  );

  preview.business_tag = null;

  if (business_tag) {
    preview.business_tag = pick(moment.business_tag, ["value", "type"]);
  }

  if (url_tag) {
    preview.url_tag = url_tag;
  }

  if (location_tag) {
    preview.location_tag = location_tag;
  }

  preview.source = null;
  if (momentSource) {
    preview.source = momentSource?.uri ?? momentSource;
  }

  return omit(preview, ["parts"]);
};

export const formatBusinessRankingTitle = (business) => {
  const { languageContent } = getLanguageContent();

  return `# ${business.ranking} ${business.category.title} ${languageContent.in} ${business.location.city}`;
};
