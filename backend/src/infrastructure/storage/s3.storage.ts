import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client,} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StorageService } from "./storage.interface";

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const bucket = process.env.S3_BUCKET!;

export class S3StorageService implements StorageService {
  async createUploadUrl(
    storageKey: string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: storageKey,
      ContentType: contentType,
    });

    return getSignedUrl(s3, command, {
      expiresIn: 15 * 60,
    });
  }

  async createDownloadUrl(
    storageKey: string,
    filename?: string
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: storageKey,
      ResponseContentDisposition: filename
        ? `attachment; filename="${filename}"`
        : undefined,
    });

    return getSignedUrl(s3, command, {
      expiresIn: 15 * 60,
    });
  }

  async objectExists(
    storageKey: string
  ): Promise<boolean> {
    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: storageKey,
        })
      );

      return true;
    } catch {
      return false;
    }
  }

  async deleteObject(
    storageKey: string
  ): Promise<void> {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: storageKey,
      })
    );
  }
}