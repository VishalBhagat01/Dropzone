import crypto from "node:crypto";

import { prisma } from "../../infrastructure/prisma";
import { storage } from "../../infrastructure/storage/storage";

import { UploadInitInput } from "./upload-init.schema";

export async function initializeUpload(
  input: UploadInitInput
) {
  const shareCode = crypto
    .randomBytes(9)
    .toString("base64url");

  const storageKey = `uploads/${crypto.randomUUID()}`;

  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  const file = await prisma.file.create({
    data: {
      shareCode,
      originalFilename: input.filename,
      storageKey,
      fileSize: BigInt(input.size),
      mimeType: input.mimeType,
      expiresAt,
      status: "PENDING",
    },
  });

  const uploadUrl = await storage.createUploadUrl(
    storageKey,
    input.mimeType
  );

  return {
    fileId: file.id,
    shareCode: file.shareCode,
    uploadUrl,
    expiresAt: file.expiresAt,
  };
}