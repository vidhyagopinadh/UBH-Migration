export function blobToFile(theBlob, fileName): Blob | null {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}
