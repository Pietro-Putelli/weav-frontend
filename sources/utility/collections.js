import _, { cloneDeep, findIndex } from "lodash";

export const unionUsingPriority = (coll1, coll2) => {
  const coll2Ids = coll2.map((col) => col.id);

  const filteredCol1 = coll1.filter((col) => !coll2Ids.includes(col.id));

  return _.unionBy(coll2, filteredCol1, "id");
};

export const rewriteData = (items, data) => {
  const newCollection = items.filter((item) => {
    return item.id != data.id;
  });

  return _.unionBy(newCollection, [data], "id");
};

export const includesById = (array, element) =>
  array.map((a) => a.id).includes(element.id);

export const differenceUsingId = (arr1, arr2) => {
  let diff = [];

  const mappedIds = arr2.map((a) => a.id);

  for (const a of arr1) {
    if (!mappedIds.includes(a.id)) diff.push(a);
  }

  return diff;
};

export const count = (items) => {
  return (items ?? []).length;
};

export const excludeIndexs = (array, ...indexs) => {
  return array.filter((item, index) => {
    if (!indexs.includes(index)) {
      return item;
    }
  });
};

export const remapUsingIds = (items, transform = null) => {
  return items.map((item) => {
    const itemId = item.id;

    if (transform) {
      return transform(itemId);
    }
    return itemId;
  });
};

export const getChangedFields = ({ prev, next, omit = [] }) => {
  const response = {};

  const _prev = prev ?? {};
  const _next = next ?? {};

  for (const [key, value] of Object.entries(_next)) {
    if (_prev[key] != value && !omit.includes(key)) {
      response[key] = value;
    }
  }

  return response;
};

export const remapUsingKey = (items, key) => {
  return items.map((item) => {
    return item[key];
  });
};

export const handleSelection = (items, item) => {
  let newItems = cloneDeep(items);
  const index = findIndex(items, ["id", item.id]);

  let isAdded = true;

  if (index != -1) {
    isAdded = false;
    newItems = newItems.filter((_item) => {
      return item.id != _item.id;
    });
  } else {
    newItems.push(item);
  }

  return [newItems, isAdded];
};
