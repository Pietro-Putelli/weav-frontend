import { pick } from "lodash";
import { removeNewLines } from "../../utility/strings";
import { appendSourceTo, isInFileSystem } from "./utility";

/* Used both for USER and BUSINESS post */
export const formatPost = async ({ slices, postId, ordering }) => {
  const formData = new FormData();

  for (let index = 0; index < slices.length; index++) {
    const slice = slices[index];

    const source = slice?.source;

    const sourceName = `source_${index}`;
    const dataName = `data_${index}`;

    const isCreating = isInFileSystem(source);

    if (source && isCreating) {
      await appendSourceTo(formData, { source, name: sourceName });
    }

    let data = pick(slice, ["title", "content"]);

    data.title = removeNewLines(data.title);
    data.content = removeNewLines(data.content);

    if (!isCreating) {
      data = {
        id: slice.id,
        ...data,
      };
    }

    formData.append(dataName, JSON.stringify(data));
  }

  let data = {
    post_id: postId,
    slices_count: slices.length,
  };

  if (ordering) {
    data = { ...data, ordering };
  }

  formData.append("data", JSON.stringify(data));

  return formData;
};
