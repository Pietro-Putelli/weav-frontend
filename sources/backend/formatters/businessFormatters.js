import { isEmpty, omit, pickBy, size } from "lodash";
import { formatTimeTableDateTime } from "../../dates/timetable";
import { isNullOrUndefined } from "../../utility/boolean";
import { getChangedFields, remapUsingIds } from "../../utility/collections";
import { formatPhone } from "../../utility/formatters";
import { numberize } from "../../utility/functions";
import { formatLink, removeAllNewEmptyLines } from "../../utility/strings";
import { isValidLocation } from "../../utility/validators";
import { appendSourceTo, isInFileSystem } from "./utility";

export const formatCreateBusiness = async (business) => {
  const formData = new FormData();

  const {
    phone,
    category,
    categories,
    amenities,
    cover_source,
    location,
    menu_url,
    web_url,
    ticket_url,
    timetable,
    description,
  } = business;

  let newBusiness = omit(business, [
    "phone",
    "location",
    "category",
    "categories",
    "amenities",
    "cover_source",
  ]);

  newBusiness = pickBy(newBusiness, (data) => {
    return !isNullOrUndefined(data);
  });

  if (category) {
    newBusiness.category = numberize(category.id);
  }

  if (categories && size(categories) > 0) {
    newBusiness.categories = remapUsingIds(categories, numberize);
  }

  if (amenities && size(amenities) > 0) {
    newBusiness.amenities = remapUsingIds(amenities, numberize);
  }

  if (isValidLocation(location)) {
    newBusiness.location = location;
  }

  newBusiness.menu_url = formatLink(menu_url);

  newBusiness.web_url = formatLink(web_url);

  newBusiness.ticket_url = formatLink(ticket_url);

  newBusiness.description = removeAllNewEmptyLines(description);

  if (phone?.number) {
    newBusiness.phone = formatPhone({ phone, isPlain: true });
  }

  if (timetable) {
    newBusiness["timetable"] = formatTimeTableDateTime(timetable);
  }

  formData.append("data", JSON.stringify(newBusiness));

  /* Handle source */

  if (isInFileSystem(cover_source)) {
    await appendSourceTo(formData, {
      source: cover_source,
      name: "cover_source",
    });
  }

  return formData;
};

export const formatUpdateBusiness = async ({ prev, next }) => {
  const formData = new FormData();

  const cover_source = next.cover_source;

  let business = getChangedFields({ prev, next });
  const phone = business?.phone;

  if (isInFileSystem(cover_source)) {
    await appendSourceTo(formData, {
      source: cover_source,
      name: "cover_source",
    });
  }

  const amenities = business?.amenities;
  const categories = business?.categories;
  const category = business?.category;

  if (category) {
    business.category = numberize(business.category.id);
  }

  if (categories) {
    business.categories = remapUsingIds(categories, numberize);
  }

  if (amenities) {
    business.amenities = remapUsingIds(amenities, numberize);
  }

  if (phone?.number !== "") {
    business.phone = formatPhone({ phone, isPlain: true });
  } else {
    business.phone = null;
  }

  const { menu_url, web_url, ticket_url, description, timetable } = business;

  if (menu_url) {
    business.menu_url = formatLink(menu_url);
  }

  if (web_url) {
    business.web_url = formatLink(web_url);
  }

  if (ticket_url) {
    business.ticket_url = formatLink(ticket_url);
  }

  if (description) {
    business.description = removeAllNewEmptyLines(description);
  }

  if (timetable) {
    business.timetable = formatTimeTableDateTime(timetable);
  }

  formData.append("data", JSON.stringify(business));

  return formData;
};
