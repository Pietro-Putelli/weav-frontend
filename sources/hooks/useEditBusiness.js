import { isEmpty, isEqual, isNull, omit } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BusinessAPI from "../backend/business";
import {
  formatCreateBusiness,
  formatUpdateBusiness,
} from "../backend/formatters/businessFormatters";
import { convertTimetableForBusiness } from "../dates/timetable";
import { createBusinessState } from "../handlers/business";
import { INITIAL_EDIT_BUSINESS } from "../store/initialStates";
import {
  getEditBusiness,
  setCurrentBusiness,
  setEditBusiness,
} from "../store/slices/businessesReducer";
import { isNullOrUndefined } from "../utility/boolean";
import {
  isTimetable,
  isValidLocation,
  isValidText,
} from "../utility/validators";
import useCurrentBusiness from "./useCurrentBusiness";

const EVENT_REMOVE_FIELDS = ["location", "categories", "timetable"];

const useEditBusiness = ({ profileType } = {}) => {
  /* States */
  const { business: currentBusiness, doesBusinessExist: isEditing } =
    useCurrentBusiness();

  /* Current business object working on (both create and edit) */
  const editBusiness = useSelector(getEditBusiness);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  /* Effects */

  useEffect(() => {
    if (isEditing) {
      dispatch(setEditBusiness(currentBusiness));
    } else {
      dispatch(setEditBusiness(null));
    }
  }, []);

  /* Props */

  const isEventProfile = useMemo(() => {
    if (isEditing) {
      return isNull(currentBusiness.location);
    }

    return profileType == "event";
  }, [isEditing, currentBusiness]);

  const initialEditBusiness = useMemo(() => {
    if (isEventProfile) {
      return omit(INITIAL_EDIT_BUSINESS, EVENT_REMOVE_FIELDS);
    }
    return INITIAL_EDIT_BUSINESS;
  }, [isEventProfile]);

  const hasChanged = useMemo(() => {
    const before = omit(currentBusiness, ["extra_data", "settings"]);
    const after = omit(editBusiness, ["extra_data", "settings"]);

    const isCurrentEmpty = isEmpty(before);

    if (isCurrentEmpty && isEqual(editBusiness, initialEditBusiness)) {
      return false;
    }

    return !isEqual(before, after);
  }, [currentBusiness, editBusiness]);

  const isDoneEnbled = useMemo(() => {
    const {
      name,
      location,
      category,
      categories,
      timetable,
      extra_data,
      cover_source,
    } = editBusiness;

    const isCoverValid = !isNull(cover_source);
    const isNameValid = isValidText({ text: name });
    const isLocationValid = isValidLocation(location);

    const isCategoryValid =
      !isNullOrUndefined(category) ||
      !isEmpty(categories) ||
      !isEmpty(extra_data.custom_categories);

    const isTimetableValid = isTimetable(timetable);

    if (isEventProfile) {
      return isCoverValid && isNameValid;
    }

    return (
      isCoverValid &&
      isNameValid &&
      isLocationValid &&
      isCategoryValid &&
      isTimetableValid
    );
  }, [editBusiness, isEventProfile]);

  /* Methods */

  const changeBusiness = (data) => {
    dispatch(setEditBusiness(data));
  };

  const _updateBusiness = async (callback) => {
    const newBusiness = await formatUpdateBusiness({
      next: editBusiness,
      prev: currentBusiness,
    });

    BusinessAPI.update(newBusiness, (business) => {
      const isDone = !isNull(business);

      const timetable = convertTimetableForBusiness(business.timetable);

      if (isDone) {
        dispatch(setCurrentBusiness({ ...business, timetable }));
      }

      callback(isDone);
    });
  };

  const _createBusiness = async (callback) => {
    const newBusiness = await formatCreateBusiness(editBusiness);

    BusinessAPI.create(newBusiness, (business) => {
      const isDone = !isNull(business);

      if (isDone) {
        dispatch(createBusinessState(business));
      }

      callback(isDone);
    });
  };

  const createOrUpdate = (callback) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    (isEditing ? _updateBusiness : _createBusiness)((isDone) => {
      callback(isDone);

      if (!isDone) {
        setIsLoading(false);
      }
    });
  };

  return {
    business: omit(editBusiness, isEventProfile ? EVENT_REMOVE_FIELDS : []),
    isEditing,
    isEventProfile,
    hasChanged,
    isDoneEnbled,
    isLoading,

    changeBusiness,
    createOrUpdate,
  };
};

export default useEditBusiness;
