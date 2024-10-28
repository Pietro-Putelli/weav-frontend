import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useEffect, useMemo, useState } from "react";
import { checkPhotoLibraryPermission } from "../utility/permissions";
import useUser from "./useUser";
import { pick } from "lodash";

const useMediaLibrary = ({ bulkCount, ...props }) => {
  const { permissions } = useUser();

  const [hasLimitedPermission, setHasLimitedPermission] = useState(false);

  const [state, setState] = useState({
    assets: [],
    lastCursor: null,
    album: null,
  });

  const [isChanging, setIsChanging] = useState(false);

  /* Effects */

  useEffect(() => {
    getAssets();
  }, [permissions.media, state.album]);

  useEffect(() => {
    checkPhotoLibraryPermission(({ isLimited }) => {
      setHasLimitedPermission(isLimited);
    });
  }, []);

  /* Props */

  const options = useMemo(() => {
    return {
      first: bulkCount,
      assetType: "Photos",
      include: ["imageSize"],
    };
  }, [bulkCount, state, props]);

  /* Functions */

  const getAssets = () => {
    if (state.lastCursor) {
      options.after = state.lastCursor;
    }

    if (permissions.media) {
      CameraRoll.getPhotos(options).then((data) => {
        _appendAssets(data);

        if (isChanging) {
          setTimeout(() => {
            setIsChanging(false);
          }, 200);
        }
      });
    }
  };

  const changeAlbum = (album) => {
    setIsChanging(true);
    setState({ assets: [], lastCursor: null, album });
  };

  const _appendAssets = ({ page_info, edges }) => {
    const { end_cursor } = page_info;

    const assets = edges.map(({ node }) => {
      return pick(node.image, ["height", "width", "uri"]);
    });

    const nextState = {
      lastCursor: null,
      assets: [],
    };

    if (assets.length > 0) {
      nextState.lastCursor = end_cursor;
      nextState.assets = state.assets.concat(assets);

      setState({ ...state, ...nextState });
    }
  };

  return {
    assets: state.assets,
    album: state.album,
    getAssets,
    changeAlbum,
    isChanging,
    hasLimitedPermission,
  };
};

export default useMediaLibrary;
