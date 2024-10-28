import { isNull, isUndefined } from "lodash";
import { useSelector } from "react-redux";
import { getMyMomentsState } from "../store/slices/momentsReducer";
import { getUserSecretInfo } from "../store/slices/secretReducer";
import {
  getPermissionsGranted,
  getUser,
  getUserFakePosition,
  getUserPosition,
} from "../store/slices/userReducer";
import { isNullOrUndefined } from "../utility/boolean";
import useCurrentBusiness from "./useCurrentBusiness";

const useUser = ({ userId } = {}) => {
  const user = useSelector(getUser);
  const secretInfo = useSelector(getUserSecretInfo);

  const myMoments = useSelector(getMyMomentsState);

  const { city, coordinate, place_id } = useSelector(getUserPosition);
  const searchType = city != undefined ? "city" : "nearby";
  const isInCity = searchType == "city";

  const permissions = useSelector(getPermissionsGranted);

  const { coordinate: fakedCoordinate, city: fakedCity } =
    useSelector(getUserFakePosition);

  const { isBusiness } = useCurrentBusiness();

  const doesUserExists =
    !isNullOrUndefined(user.id) && !isNull(secretInfo.userToken);

  const doesUserTokenExists = !isNull(secretInfo.userToken);

  return {
    ...user,
    userId: user.id,
    coordinate,
    city: fakedCity ?? city,
    isInCity,
    searchType,
    placeId: place_id,
    permissions,
    isPositionFaked: !isUndefined(fakedCoordinate),
    amI: user.id == userId && !isBusiness,
    hasMoments: myMoments?.length > 0,
    hasBusiness: user?.hasBusiness,
    hasLocationPermission: permissions.location,
    hasNotificationPermission: permissions.notifications,
    secretInfo,
    doesUserExists,
    doesUserTokenExists,
  };
};

export default useUser;
