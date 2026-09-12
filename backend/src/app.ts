import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import { healthRoutes } from "./modules/health/health.routes";
import { storageTestRoutes } from "./modules/health/storage-test.routes";
import { uploadInitRoutes } from "./modules/files/upload-init.routes";
import { completeUploadRoutes } from "./modules/files/complete-upload.routes";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(helmet);

  app.register(cors, {
    origin: true,
  });

  app.register(healthRoutes);
  app.register(storageTestRoutes);
  app.register(uploadInitRoutes);
  app.register(completeUploadRoutes);

  return app;
}