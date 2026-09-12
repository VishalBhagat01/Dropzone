import { FastifyInstance } from "fastify";
import { prisma } from "../../infrastructure/prisma";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health/live", async () => {
    return {
      status: "ok",
    };
  });

  app.get("/health/ready", async () => {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "ok",
      database: "connected",
    };
  });
}