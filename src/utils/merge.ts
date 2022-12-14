type Indexed<T = unknown> = {
  [key in string]: T;
};

function merge(lhs: Indexed, rhs: Indexed): Indexed {
  Object.keys(rhs).forEach((key) => {
    if (!lhs[key]) {
      // eslint-disable-next-line no-param-reassign
      lhs[key] = rhs[key];
      return;
    }

    merge(lhs[key] as Indexed, rhs[key] as Indexed);
  });
  return lhs;
}

export default merge;
