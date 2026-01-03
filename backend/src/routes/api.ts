import { FastifyInstance } from "fastify";
export async function apiRoutes(fastify: FastifyInstance) {
    fastify.get('/api/status', async (request, reply) => {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            service: "Will It Merge API"
        }
    })

    fastify.get('/api/greeting', async (request, reply) => {
        return {
            message: 'Hello from Will It Merge',
            timestamp: new Date().toISOString()
        }
    })
}