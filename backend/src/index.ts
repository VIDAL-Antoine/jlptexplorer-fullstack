import "dotenv/config";
import fastify from "fastify";
import { registerCors } from "./plugins/cors.js";
import { scenesRoutes } from "./routes/v1/scenes/index.js";
import { grammarPointsRoutes } from "./routes/v1/grammar-points/index.js";
import { sourcesRoutes } from "./routes/v1/sources/index.js";

async function start() {
  const server = fastify({ logger: true });

  await registerCors(server);

  server.get("/ping", async () => {
    return { status: "ok" };
  });

  await server.register(
    async (api) => {
      api.register(sourcesRoutes, { prefix: "/sources" });
      api.register(scenesRoutes, { prefix: "/scenes" });
      api.register(grammarPointsRoutes, { prefix: "/grammar-points" });
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
