import { timeStamp } from "console";
import { FastifyInstance } from "fastify";
export async function apiRoutes(fastify: FastifyInstance) {
    fastify.get('/api/status', async (request, reply) => {
        return {
            status: "ok",
            timeStamp: new Date().toISOString(),
            service: "Will It Merge API"
        }
    })
}