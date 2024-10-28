import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileByIdOrUsername } from "../backend/profile";
import { getProfileByIdOrUsernameState } from "../store/slices/profilesReducer";
import { getState } from "../store/store";

const useProfiles = ({ user, userId }) => {
  const amI = user == undefined;
  const dispatch = useDispatch();

  /* Use only when amI is true */

  if (amI) {
    const { user } = getState("user");
    return { profile: user };
  }

  const _userId = user?.id ?? userId;
  const _username = user?.username;

  const profile = useSelector((state) =>
    getProfileByIdOrUsernameState(state, {
      userId: _userId,
      username: _username,
    })
  );

  const refreshProfile = () => {
    dispatch(getUserProfileByIdOrUsername({ user, isMine: false }));
  };

  useEffect(() => {
    if (profile == undefined) {
      refreshProfile();
    }
  }, []);

  const _profile = profile ?? user;

  return {
    profile: _profile,
    profilePublicKey: _profile.public_key,
    refreshProfile,
  };
};

export default useProfiles;
