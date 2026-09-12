export interface StorageService {
  createUploadUrl(
    storageKey: string,
    contentType: string
  ): Promise<string>;

  createDownloadUrl(
    storageKey: string,
    filename?: string
  ): Promise<string>;

  objectExists(
    storageKey: string
  ): Promise<boolean>;

  deleteObject(
    storageKey: string
  ): Promise<void>;
}