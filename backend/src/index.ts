import fastify from "fastify";

const server = fastify({ logger: true });

server.get("/ping", async () => {
  return { status: "ok" };
});

server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server listening at ${address}`);
});
