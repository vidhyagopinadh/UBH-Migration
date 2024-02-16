export const singleToDouble = (stringSet: string): string => {
  return stringSet.replace(/\'/g, '"');
};
