import { isEmpty, isNull, isUndefined } from "lodash";

export const OR = (...values) => {
  let response = values[0];

  for (let value of values) {
    response |= value;
  }

  return Boolean(response);
};

export const AND = (...values) => {
  let response = values[0];

  for (let value of values) {
    response &= value;
  }

  return Boolean(response);
};

export const isNullOrUndefined = (item) => {
  return OR(isNull(item), isUndefined(item), isEmpty(item));
};

export const IS_ALL_NULL = (...values) => {
  let response = isNullOrUndefined(values[0]);

  for (let value of values) {
    response &= isNullOrUndefined(value);
  }

  return Boolean(response);
};

export const boolToInteger = (value) => {
  if (value) {
    return 1;
  }
  return 0;
};

export const isNullOrEmptyObject = (obj) => {
  return isEmpty(obj) || isNull(obj);
};
