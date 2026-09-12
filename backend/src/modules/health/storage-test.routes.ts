import { FastifyInstance } from "fastify";
import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";

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

export async function storageTestRoutes(app: FastifyInstance) {
  app.get("/health/storage", async (_request, reply) => {
    try {
      await s3.send(
        new HeadBucketCommand({
          Bucket: bucket,
        })
      );

      return {
        status: "ok",
        storage: "connected",
        bucket,
      };
    } catch (error) {
      app.log.error(error);

      return reply.status(503).send({
        status: "error",
        storage: "unavailable",
      });
    }
  });
}