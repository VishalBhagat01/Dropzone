import { FastifyInstance } from "fastify";

import { completeUpload } from "./complete-upload.service";

export async function completeUploadRoutes(
  app: FastifyInstance
) {
  app.post(
    "/api/v1/files/:shareCode/complete",
    async (request, reply) => {
      const { shareCode } = request.params as {
        shareCode: string;
      };

      try {
        const result = await completeUpload(
          shareCode
        );

        return reply.status(200).send({
          data: result,
        });
      } catch (error) {
        if (error instanceof Error) {
          switch (error.message) {
            case "FILE_NOT_FOUND":
              return reply.status(404).send({
                error: "FILE_NOT_FOUND",
              });

            case "FILE_NOT_PENDING":
              return reply.status(409).send({
                error: "FILE_NOT_PENDING",
              });

            case "FILE_EXPIRED":
              return reply.status(410).send({
                error: "FILE_EXPIRED",
              });

            case "FILE_NOT_UPLOADED":
              return reply.status(400).send({
                error: "FILE_NOT_UPLOADED",
              });
          }
        }

        app.log.error(error);

        return reply.status(500).send({
          error: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  );
}