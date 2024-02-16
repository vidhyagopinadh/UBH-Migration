interface IBlob {
  lastModifiedDate?: Date;
  name?: string;
  size?: number;
  type?: string;
  arrayBuffer?: object;
  slice?: object;
  stream?: string;
  text?: string;
}
export function blobToFile(theBlob: IBlob, fileName: string): IBlob | null {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}
