export default interface IStorageprovider {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
