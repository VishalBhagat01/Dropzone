import { FastifyInstance } from "fastify";

import { uploadInitSchema } from "./upload-init.schema";
import { initializeUpload } from "./upload-init.service";

export async function uploadInitRoutes(
  app: FastifyInstance
) {
  app.post(
    "/api/v1/files/upload-init",
    async (request, reply) => {
      const result = uploadInitSchema.safeParse(
        request.body
      );

      if (!result.success) {
        return reply.status(400).send({
          error: "INVALID_REQUEST",
          message: "Invalid upload request",
          details: result.error.flatten(),
        });
      }

      const upload = await initializeUpload(
        result.data
      );

      return reply.status(201).send({
        data: upload,
      });
    }
  );
}