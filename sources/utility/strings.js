import { isEmpty } from "lodash";
import { isNullOrUndefined } from "./boolean";

export const removeNewLines = (string) => {
  return string ? string.replace(/\n/g, "") : "";
};

export const isNullOrEmpty = (string) => {
  return isEmpty(string) || string == null || string == undefined;
};

export const characterCountWithoutSpaces = (string) => {
  return removeNewLines(string).length;
};

export const isBase64String = (value) => {
  if (isNullOrUndefined(value)) {
    return false;
  }

  return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(
    value
  );
};

export const removeWhiteSpaces = (string) => {
  return string ? string.replace(/\s/g, "") : "";
};

export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatLink = (string) => {
  if (isEmpty(string)) {
    return null;
  }

  const value = String(string).toLowerCase();

  if (!value.includes("http://") && !value.includes("https://")) {
    return "https://" + value;
  }
  return value;
};

export const removeAllNewEmptyLines = (string) => {
  if (string == null || string == undefined) {
    return string;
  }

  return string
    .split("\n")
    .filter(function (line) {
      return line.trim() !== "";
    })
    .join("\n");
};

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const capitalizeAllFirstLetters = (string) => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const normalizeEmail = (string) => {
  return string ? string.toLowerCase() : "";
};

export const normalizeString = (string) => {
  return string.replace(/\s/g, "");
};
