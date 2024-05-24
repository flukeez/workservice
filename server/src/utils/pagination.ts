export const pagination = (totalItem: number, itemPerPage: number): number => {
  if (totalItem < 1) {
    return 0;
  } else {
    return Math.ceil(totalItem / itemPerPage);
  }
};
