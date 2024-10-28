import _ from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BusinessAPI from "../backend/business";
import { getBusinessFeaturesState } from "../store/slices/businessesReducer";

const useStaticFeatures = (mode) => {
  const { categories, amenities } = useSelector((state) =>
    getBusinessFeaturesState(state, mode)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      (_.isEmpty(categories) && mode == "categories") ||
      (_.isEmpty(amenities) && mode == "amenities") ||
      (mode == "both" && _.isEmpty(categories))
    ) {
      dispatch(BusinessAPI.getFeatures(mode));
    }
  }, []);

  return { categories, amenities };
};

export default useStaticFeatures;
