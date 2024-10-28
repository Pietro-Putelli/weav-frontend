import { isEmpty, isNull, size } from "lodash";
import { WEEK_DAYS } from "../dates/constants";
import { isNullOrUndefined } from "./boolean";
import { removeNewLines, removeWhiteSpaces } from "./strings";
import { MAX_NAME_LENGTH, MIN_USERNAME_LENGTH } from "../constants/constants";
import { MAX_USERNAME_LENGTH } from "../constants/constants";

export const isURL = (str, callback) => {
  const HTTPS = "https://";

  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  if (!!pattern.test(str)) {
    let param = str;
    if (!str.includes(HTTPS)) param = HTTPS + str;

    fetch(param, { method: "HEAD" })
      .then(() => callback?.(true, param))
      .catch((e) => callback?.(false));
    return;
  }
  callback?.(false);
};

export function isEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export const isUsername = (username) => {
  if (!username) {
    return false;
  }

  const formattedUsername = String(username).replace(/[\u2026]/g, "."); // replace ... with .

  const regex = /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*$/;

  const letters = String(username)
    .trim()
    .replace(/\./g, "")
    .replace(/\_/g, "")
    .replace(/\-/g, "");

  const usernameSize = size(formattedUsername);

  return (
    !isEmpty(letters) &&
    regex.test(formattedUsername) &&
    usernameSize >= MIN_USERNAME_LENGTH &&
    usernameSize <= MAX_USERNAME_LENGTH
  );
};

export const isName = (name) => {
  return (
    isValidText({ text: name, minLength: 4, maxLength: MAX_NAME_LENGTH }) &&
    name.replace(/ /g, "").length > 0
  );
};

export const isPassword = (password) => {
  return (
    !password.includes(" ") &&
    password.length >= 8 &&
    /^[a-zA-Z0-9-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]+$/.test(password)
  );
};

export const isPhone = (phone) => {
  return /^(\+?\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(
    phone
  );
};

export const isValidPhoneObject = (phone) => {
  return (
    !isNullOrUndefined(phone) &&
    isValidText({ text: phone.number, minLength: 8 })
  );
};

export function isComplexPassword(password) {
  const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
  return regex.test(String(password));
}

export const isTimetable = (timetable) => {
  if (isNull(timetable)) {
    return false;
  }

  let isValid = true;

  for (let index = 0; index < WEEK_DAYS.length; index++) {
    const day = WEEK_DAYS[index];
    const dayTimetable = timetable[day];

    isValid =
      isValid &&
      (!isEmpty(dayTimetable.times.join("")) || dayTimetable.isClosed);
  }

  return isValid;
};

function containsWhitespace(str) {
  return /\s/.test(str);
}

export const isValidText = ({
  text,
  minLength = 0,
  maxLength = null,
  noSpaces,
}) => {
  const textWithoutSpaces = text ? text.replace(/\s/g, "") : "";

  const isTextValid =
    !isEmpty(textWithoutSpaces) && textWithoutSpaces.length >= minLength;

  if (noSpaces) {
    return !containsWhitespace(text) && isTextValid;
  }

  if (maxLength) {
    return isTextValid && size(textWithoutSpaces) <= maxLength;
  }

  return isTextValid;
};

export const isValidLocation = (location) => {
  if (isNullOrUndefined(location)) {
    return false;
  }

  const coordinate = location?.coordinate;

  if (!coordinate) {
    return false;
  }

  return coordinate.longitude != null && coordinate.latitude != null;
};

export const isValidMessage = (message) => {
  return removeNewLines(removeWhiteSpaces(message)).length > 0;
};

export const isLocalMemoryUri = (source) => {
  const uri = source?.uri ?? source;

  if (uri == null) return false;

  const prefixes = [
    "file://",
    "content://",
    "data:",
    "ph://",
    "assets-library://",
    "/private",
  ];
  return prefixes.some((prefix) => uri.startsWith(prefix));
};
