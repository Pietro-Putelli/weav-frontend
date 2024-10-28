import { findIndex } from "lodash";

export const formatPostSlices = (post) => {
  const ordering = post.ordering.split("-");

  const postSlices = post.slices;
  const slices = new Array(ordering.length);

  ordering.forEach((id, index) => {
    const sliceIndex = findIndex(postSlices, ["id", parseInt(id)]);

    if (sliceIndex != -1) {
      const slice = postSlices[sliceIndex];
      slices[index] = slice;
    }
  });

  return { ...post, slices };
};
