export const getItemLayoutForSize = (size, index) => ({
  length: size,
  offset: size * index,
  index,
});
