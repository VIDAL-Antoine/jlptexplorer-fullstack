import "dotenv/config";
import fastify from "fastify";
import { registerCors } from "@/plugins/cors";
import { sourcesPublicRoutes, sourcesAdminRoutes } from "@/routes/v1/sources";
import { scenesPublicRoutes, scenesAdminRoutes } from "@/routes/v1/scenes";
import { grammarPointsRoutes } from "@/routes/v1/grammar-points";
import { speakersPublicRoutes, speakersAdminRoutes } from "@/routes/v1/speakers";

async function start() {
  const server = fastify({ logger: true });

  await registerCors(server);

  server.get("/ping", async () => {
    return { status: "ok" };
  });

  await server.register(
    async (api) => {
      api.register(async (localeApi) => {
        localeApi.register(sourcesPublicRoutes, { prefix: "/sources" });
        localeApi.register(scenesPublicRoutes, { prefix: "/scenes" });
        localeApi.register(grammarPointsRoutes, { prefix: "/grammar-points" });
        localeApi.register(speakersPublicRoutes, { prefix: "/speakers" });
      }, { prefix: "/:locale" });
      api.register(scenesAdminRoutes, { prefix: "/scenes" });
      api.register(speakersAdminRoutes, { prefix: "/speakers" });
      api.register(sourcesAdminRoutes, { prefix: "/sources" });
    },
    { prefix: "/api/v1" }
  );

  server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`Server listening at ${address}`);
  });
}

start();
