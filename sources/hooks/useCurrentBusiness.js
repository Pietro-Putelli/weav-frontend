import { isNull, omit } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BusinessAPI from "../backend/business";
import { saveBusinessData } from "../handlers/business";
import {
  getCurrentBusiness,
  getMyBusinessesState,
} from "../store/slices/businessesReducer";
import { getUserSecretInfo } from "../store/slices/secretReducer";
import { getUser } from "../store/slices/userReducer";
import { formatShareBusiness } from "../utility/shareApis";
import { isNullOrEmpty } from "../utility/strings";

const useCurrentBusiness = ({ reqBusiness } = {}) => {
  const currentBusiness = useSelector(getCurrentBusiness);
  const myBusinesses = useSelector(getMyBusinessesState);

  const { businessToken } = useSelector(getUserSecretInfo);

  const businessId = currentBusiness?.id;

  const doesBusinessExist =
    !isNullOrEmpty(currentBusiness) && !isNull(businessToken);

  const { isBusiness } = useSelector(getUser);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (reqBusiness) {
      fetchBusinessData();
    }
  }, []);

  const currentLocation = useMemo(() => {
    return currentBusiness?.location;
  }, [currentBusiness]);

  const shareBusinessSticker = useMemo(() => {
    if (doesBusinessExist) {
      return formatShareBusiness(currentBusiness);
    }
  }, [currentBusiness]);

  const fetchBusinessData = () => {
    dispatch(
      BusinessAPI.getMine({ businessId }, (business) => {
        setIsRefreshing(false);

        if (business) {
          dispatch(saveBusinessData({ business }));
        }
      })
    );
  };

  const refreshBusiness = () => {
    setIsRefreshing(true);

    fetchBusinessData();
  };

  return {
    isBusiness,
    doesBusinessExist,

    business: omit(currentBusiness, ["auth_token"]),
    businessId,
    businessLocation: currentBusiness?.location,
    isRefreshing,
    isBusinessApproved: currentBusiness?.is_approved,
    currentLocation,
    shareBusinessSticker,
    myBusinesses,

    refreshBusiness,
  };
};

export default useCurrentBusiness;
