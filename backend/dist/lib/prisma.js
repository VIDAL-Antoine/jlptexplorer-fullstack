"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_js_1 = require("../generated/prisma/client.js");
const globalForPrisma = globalThis;
function createPrismaClient() {
    const connectionString = process.env["DATABASE_URL"];
    if (!connectionString)
        throw new Error("DATABASE_URL is not set");
    const adapter = new adapter_pg_1.PrismaPg({ connectionString });
    return new client_js_1.PrismaClient({ adapter });
}
exports.prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env["NODE_ENV"] !== "production")
    globalForPrisma.prisma = exports.prisma;
//# sourceMappingURL=prisma.js.map