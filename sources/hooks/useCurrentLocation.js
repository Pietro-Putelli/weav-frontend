import NetInfo from "@react-native-community/netinfo";
import { isUndefined } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getUserFakePosition } from "../store/slices/userReducer";
import useCurrentBusiness from "./useCurrentBusiness";
import useUser from "./useUser";

const useCurrentLocation = (callback, deps = []) => {
  const { coordinate, permissions, placeId } = useUser();
  const { coordinate: fakedCoordinate } = useSelector(getUserFakePosition);

  const { isBusiness } = useCurrentBusiness();

  const prevPlaceId = useRef(null);
  const prevIsBusiness = useRef(null);

  useEffect(() => {
    if (!isUndefined(fakedCoordinate)) {
      prevPlaceId.current = null;
      callback();
      return;
    }

    if (placeId && prevPlaceId.current != placeId) {
      prevPlaceId.current = placeId;
      callback();
      return;
    }

    if (prevIsBusiness.current != isBusiness) {
      prevIsBusiness.current = isBusiness;
      callback();
      return;
    }
  }, [
    isBusiness,
    coordinate?.longitude,
    fakedCoordinate,
    permissions.location,
    ...deps,
  ]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
      const isAllowed = isConnected && permissions.location;

      // setIsAllowed(isAllowed);

      // if (!isAllowed) {
      //   // failCallback?.();
      // }
    });

    return () => {
      unsubscribe();
    };
  }, [permissions.location]);
};

export default useCurrentLocation;
