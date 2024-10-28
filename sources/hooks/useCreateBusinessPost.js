import {
  cloneDeep,
  findIndex,
  isEmpty,
  isEqual,
  isUndefined,
  merge,
  pick,
  unionBy,
  uniqueId,
} from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { formatPost } from "../backend/formatters/postFormatters";
import {
  createOrUpdateBusinessPost,
  deleteBusinessPost,
  deleteBusinessPostSlice,
} from "../backend/posts";
import { MAX_POST_SLICES } from "../constants/constants";
import {
  createMyBusinessPost,
  updateMyBusinessPost,
} from "../store/slices/businessPostsReducer";
import { numberize } from "../utility/functions";
import useCurrentBusiness from "./useCurrentBusiness";

const useCreateBusinessPost = ({ initialPost } = {}) => {
  const [post, setPost] = useState();

  const slices = post?.slices ?? [];
  const slicesCount = slices.length;

  const hasSlices = !isEmpty(slices);
  const isEditing = !isUndefined(initialPost);

  const [isLoading, setIsLoading] = useState(false);
  const [areAllSlicesInvalid, setAreAllSlicesInvalid] = useState(false);
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(false);
  const [tooManySlices, setTooManySlices] = useState(false);

  const dispatch = useDispatch();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedSlice = slices?.[selectedIndex];

  /* Effects */

  useEffect(() => {
    if (isEditing) {
      setPost(initialPost);
    }
  }, []);

  useEffect(() => {
    if (hasSlices) {
      const index = Math.max(0, slicesCount - 1);
      setSelectedIndex(index);
    }
  }, [post]);

  useEffect(() => {
    if (isCreateButtonDisabled) {
      setIsCreateButtonDisabled(false);
    }
  }, [slices]);

  /* Methods */

  const updatePostState = (data) => {
    setPost((post) => {
      return { ...post, ...data };
    });
  };

  const updatePostSliceState = (data) => {
    const { slice, sliceId, mode, index } = data;

    const slices = post?.slices ?? [];
    let newSlices = [];

    if (!isUndefined(index)) {
      newSlices = cloneDeep(slices);

      newSlices[index] = merge(newSlices[index], slice);
    } else if (mode == "add") {
      newSlices = unionBy(slices, [slice], "id");
    } else {
      const slice_id = slice?.id ?? sliceId;

      newSlices = slices.filter((slice) => {
        return slice.id !== slice_id;
      });
    }

    setPost((post) => {
      return { ...post, slices: newSlices };
    });
  };

  /* Props */

  const sliceOrdering = useMemo(() => {
    if (hasSlices) {
      const ids = slices.map(({ id }) => {
        if (String(id).includes("new")) {
          return id;
        }
        return numberize(id);
      });

      return ids.join("-");
    }
    return null;
  }, [slices]);

  const { editedSlices, hasSlicesToBeUpdated } = useMemo(() => {
    const initialSlices = initialPost?.slices ?? [];
    const initialOrdering = initialPost?.ordering ?? null;

    const editedSlices = slices.filter((slice) => {
      const index = findIndex(initialSlices, ["id", slice.id]);

      if (index != -1) {
        return !isEqual(slice, initialSlices[index]);
      }
      return true;
    });

    return {
      editedSlices,
      hasSlicesToBeUpdated:
        !isEmpty(editedSlices) || initialOrdering != sliceOrdering,
    };
  }, [slices, sliceOrdering]);

  /* Callbacks */

  const onAssetSelected = (asset) => {
    const slice = {
      id: `new.${uniqueId()}`,
      source: pick(asset, ["width", "height", "uri"]),
    };

    updatePostSliceState({ slice, mode: "add" });

    setSelectedIndex(Math.max(0, slicesCount));
  };

  /* Methods */

  const invalidCallback = () => {
    setIsLoading(false);
    setAreAllSlicesInvalid(true);
    setIsCreateButtonDisabled(true);

    setTimeout(() => {
      setAreAllSlicesInvalid(false);
    }, 3000);
  };

  const tooManySlicesCallback = () => {
    if (tooManySlices) {
      return;
    }

    setTooManySlices(true);

    setTimeout(() => {
      setTooManySlices(false);
    }, 3000);
  };

  const createOrUpdatePost = async (callback) => {
    if (slicesCount > MAX_POST_SLICES) {
      tooManySlicesCallback();
      return;
    }

    if (isLoading) {
      return;
    }

    if (hasSlicesToBeUpdated) {
      setIsLoading(true);

      const data = await formatPost({
        slices: editedSlices,
        ordering: sliceOrdering,
        postId: post?.id,
      });

      createOrUpdateBusinessPost(
        { isEditing, data },
        (post) => {
          if (post) {
            if (isEditing) {
              dispatch(updateMyBusinessPost(post));
            } else {
              dispatch(createMyBusinessPost(post));
            }
          }

          setIsLoading(false);
          callback(post);
        },
        invalidCallback
      );
    } else {
      callback(true);
    }
  };

  const deletePost = (postId, callback) => {
    dispatch(deleteBusinessPost(postId, callback));
  };

  const deletePostSlice = ({ postId, sliceId }, callback) => {
    dispatch(deleteBusinessPostSlice({ postId, sliceId }, callback));
  };

  return {
    post,
    slices,
    slicesCount,
    isEditing,
    hasSlices,
    selectedSlice,
    isLoading,
    isCreateButtonDisabled,
    areAllSlicesInvalid,
    hasPostChanged: hasSlicesToBeUpdated,
    tooManySlices,

    updatePostState,
    updatePostSliceState,
    createOrUpdatePost,
    deletePost,
    deletePostSlice,

    onAssetSelected,
    onSliceChanged: setSelectedIndex,
  };
};

export default useCreateBusinessPost;
