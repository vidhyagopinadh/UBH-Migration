export function compareObjects(
  obj1,
  obj2,
  ignoreKeyStatus,
  ignoreKeySource,
): boolean {
  const copy1 = { ...obj1 };
  const copy2 = { ...obj2 };
  delete copy1[ignoreKeyStatus];
  delete copy2[ignoreKeyStatus];
  delete copy1[ignoreKeySource];
  delete copy2[ignoreKeySource];
  return JSON.stringify(copy1) === JSON.stringify(copy2);
}
