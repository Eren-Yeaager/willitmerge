import { error } from "console";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { FastifyInstance } from "fastify";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
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
    fastify.get('/api/test-db', async (request, reply) => {
        const result = await fastify.pg.query('SELECT NOW() as current_time, version() as pg_version')
        return {
            status: 'connected',
            database: result.rows[0]
        }
    })

}