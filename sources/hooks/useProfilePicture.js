import { useState } from "react";
import { useDispatch } from "react-redux";
import { changeProfilePicture } from "../backend/profile";
import { clearImageCache } from "../utility/functions";

const useProfilePicture = () => {
  const [isSourceInvalid, setIsSourceInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const changePicture = async ({ uri }, callback) => {
    setIsLoading(true);

    clearImageCache();

    dispatch(
      changeProfilePicture(
        { uri },
        () => {
          setIsLoading(false);

          callback?.();
        },
        () => {
          setIsSourceInvalid(true);

          setIsLoading(false);

          setTimeout(() => {
            setIsSourceInvalid(false);
          }, 4000);
        }
      )
    );
  };

  const removePicture = (callback) => {
    changePicture({}, callback);
  };

  return {
    isLoading,
    changePicture,
    removePicture,
    isSourceInvalid,
  };
};

export default useProfilePicture;
