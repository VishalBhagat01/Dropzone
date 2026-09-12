import { prisma } from "../../infrastructure/prisma";
import { storage } from "../../infrastructure/storage/storage";

export async function completeUpload(shareCode: string) {
  const file = await prisma.file.findUnique({
    where: {
      shareCode,
    },
  });

  if (!file) {
    throw new Error("FILE_NOT_FOUND");
  }

  if (file.status !== "PENDING") {
    throw new Error("FILE_NOT_PENDING");
  }

  if (file.expiresAt <= new Date()) {
    await prisma.file.update({
      where: {
        id: file.id,
      },
      data: {
        status: "EXPIRED",
      },
    });

    throw new Error("FILE_EXPIRED");
  }

  const exists = await storage.objectExists(
    file.storageKey
  );

  if (!exists) {
    throw new Error("FILE_NOT_UPLOADED");
  }

  const updatedFile = await prisma.file.update({
    where: {
      id: file.id,
    },
    data: {
      status: "ACTIVE",
    },
  });

  return {
    fileId: updatedFile.id,
    shareCode: updatedFile.shareCode,
    status: updatedFile.status,
  };
}